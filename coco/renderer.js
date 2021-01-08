const ipcRenderer = require('electron').ipcRenderer;

// check if database is ready
ipcRenderer.send('db_connect', {});

// IPC 함수 호출문
ipcRenderer.on('callFunction', function (event, functionName, param) {
    // main 프로세스에서 send('callFunction', functionName, param); 함수를 호출하면 이곳에서 메시지를 받아서 처리
    switch (functionName) {
        case "connect":
            check_dbconnect(param);
            break;
        case "disconnect":
            break;
        case "checkVerified":
            check_verified(param);
            break;
        case "checkDuplicate":
            check_duplicated(param);
            break;
        case "register":
            check_register(param);
            break;
        case "login":
            check_login(param);
            break;
    }
})

function check_dbconnect(param) {
    if (param) {
        console.log("mysql 성공");
    } else {
        console.log("mysql 실패");
    }
}

// bootstrap.js를 사용하는 데 필요
window.$ = window.jquery = require("jquery");
window.popper = require("popper.js");
const bootstrap = require("bootstrap");

const remote = require('electron').remote;

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
}

// --------------------------------------------- 모달 스크립트 ----------------------------------------------
const modal_type = Object.freeze({ YESNO: 0, OK: 1 });
function show_modal(mode, modal_header, modal_body) {
    let modal;

    // 모달 모드 선택
    switch (mode) {
        case modal_type.YESNO:
            modal = document.getElementById('yes-no-modal');
            break;
        case modal_type.OK:
            modal = document.getElementById('ok-modal');
            break;
    }

    // 모달 내용 변경
    modal.querySelector('.modal-title').innerHTML = modal_header;
    modal.querySelector('.modal-body').innerHTML = modal_body;

    // 모달 보이기
    $('#' + modal.id).modal('show');
}

// --------------------------------------------- 화면 전환 스크립트 ----------------------------------------------
const div_ids = ['login-page', 'register-page'];
function change_display_to(id) {
    // 모든 div 숨기기
    for (let i = 0; i < div_ids.length; i++) {
        $('#' + div_ids[i]).hide();
    }

    // 선택한 div만 표시하기
    $('#' + id).show();
}

// --------------------------------------------- 로그인 화면 스크립트 --------------------------------------------
let user_data = {
    id: null,
    nickname: null,
    email: null,
    bio: null
}
document.getElementById('goto_register').addEventListener("click", async (event) => {
    change_display_to('register-page');
});

document.getElementById("login").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id_input = document.getElementById('login_id').value;
    const pw_input = document.getElementById('login_pw').value;
    // 로그인 시도
    const param = new Array(id_input, pw_input);
    ipcRenderer.send('tryLogin', param);
});

function check_login(arg) {
    if (arg.success) {
        // 로그인 성공
        user_data.id = arg.id;
        user_data.nickname = arg.nickname;
        user_data.email = arg.email;
        user_data.bio = arg.bio;

        show_modal(modal_type.OK, "로그인 성공!", `
        ID: ` + user_data.id + ` <br>
        닉네임: ` + user_data.nickname + ` <br>
        이메일: ` + user_data.email + ` <br>
        상메: ` + user_data.bio + ` <br>
        `);
    } else {
        // 로그인 실패
        show_modal(modal_type.OK, "로그인 실패", "로그인에 실패하였습니다. 아이디와 비밀번호를 다시 확인해 주세요.")
    }
}

// --------------------------------------------- 회원 가입 화면 스크립트 ------------------------------------------
var not_duplicated = false;
var is_verified = false;
const valid_mode = Object.freeze({ INIT: 0, VALID: 1, INVALID: 2 });

function set_valid(mode, input_id, btn_id, btn_label, feedback_id, feedback_text) {
    switch (mode) {
        case valid_mode.INIT:
            // 입력창 valid 여부 초기화
            $('#' + input_id).removeClass('is-valid').removeClass('is-invalid');
            // 버튼 초기화
            $('#' + btn_id).removeClass('btn-danger').removeClass('btn-success').addClass('btn-secondary');
            break;
        case valid_mode.VALID:
            $('#' + input_id).removeClass('is-invalid').addClass('is-valid');
            $('#' + btn_id).removeClass('btn-danger').removeClass('btn-secondary').addClass('btn-success');
            break;
        case valid_mode.INVALID:
            $('#' + input_id).removeClass('is-valid').addClass('is-invalid');
            $('#' + btn_id).removeClass('btn-success').removeClass('btn-secondary').addClass('btn-danger');
            break;
    }

    if (btn_id) {
        // 버튼 내부 값 변경
        $('#' + btn_id).html(btn_label);
    }
    if (feedback_id) {
        // 피드백 내용 변경
        $('#' + feedback_id).html(feedback_text);
    }
}

function check_verified(bool) {
    // 이메일 코드 인증 함수
    is_verified = bool;
    //console.log(is_verified);
    if (bool) {
        // alert("인증되었습니다.");
        set_valid(valid_mode.VALID, 'verification_code', 'confirm_veri', '확인', null, null);
    } else {
        // alert("잘못된 인증번호입니다.");
        set_valid(valid_mode.INVALID, 'verification_code', 'confirm_veri', '확인', 'id-veri-invalid-feedback', '잘못된 인증코드입니다.');
    }
}

function check_duplicated(bool) {
    // id 중복 확인 함수
    not_duplicated = bool;
    //console.log(not_duplicated);
    let btn_check_dup = document.getElementById("check_dup");
    if (bool) {
        // 사용 가능한 id
        set_valid(valid_mode.VALID, 'userid', 'check_dup', '사용 가능', null, null);
    } else {
        // 사용 불가능한 id
        set_valid(valid_mode.INVALID, 'userid', 'check_dup', '중복 확인', 'id-dup-invalid-feedback', "이미 존재하는 ID입니다. 다른 ID로 시도하세요.");
    }
}

function check_register(bool) {
    //console.log(bool);
    if (bool) {
        // 회원가입 성공
        // alert("회원가입에 성공하였습니다.");
        show_modal(modal_type.OK, "계정 생성하기", "회원가입에 성공하였습니다.");
    } else {
        // alert("회원가입에 실패하였습니다.");
        show_modal(modal_type.OK, "계정 생성하기", "회원가입에 실패하였습니다. 다시 시도하시거나, 문제가 반복되는 경우 관리자에게 문의하십시오.");
    }
    change_display_to('login-page')
}

$('#userid').on("propertychange change keyup paste input", async (event) => {
    not_duplicated = false;
    set_valid(valid_mode.INIT, 'userid', 'check_dup', '중복 확인', null, null);
});

document.getElementById("goto_login").addEventListener("click", async (event) => {
    change_display_to("login-page");
});

document.getElementById("check_dup").addEventListener("click", async (event) => {
    event.preventDefault();
    const id = document.getElementById("userid").value;

    if (id) {
        ipcRenderer.send('checkdup', id);
    } else {
        document.getElementById('id-dup-invalid-feedback').innerHTML = "ID를 입력해 주세요.";
        $('#userid').removeClass('is-valid').addClass('is-invalid'); // invalid 설정
    }
});

document.getElementById("send_veri").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;

    if (email) {
        ipcRenderer.send('sendveri', email);
        // alert("확인 코드를 이메일로 전송하였습니다.");
        set_valid(valid_mode.VALID, 'email', 'send_veri', '인증코드 전송', null, null);
    } else {
        // alert("이메일을 입력해주세요.");
        set_valid(valid_mode.INVALID, 'email', 'send_veri', '인증코드 전송', null, null);
    }
});

document.getElementById("confirm_veri").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const code = document.getElementById("verification_code").value;

    if (code) {
        ipcRenderer.send('confirmveri', [email, code]);
    } else {
        // alert("인증코드를 입력해주세요.");
        set_valid(valid_mode.INVALID, 'verification_code', 'confirm_veri', '확인', 'id-veri-invalid-feedback', '인증코드를 입력해주세요.');
    }
});

document.getElementById("register").addEventListener("submit", async (event) => {
    event.preventDefault();
    const pw = document.getElementById("usr_password").value;
    const pw_confirm = document.getElementById("usr_password_confirm").value;
    if (!not_duplicated) {
        // alert("중복 확인을 해 주세요");
        set_valid(valid_mode.INVALID, 'userid', 'check_dup', '중복 확인', 'id-dup-invalid-feedback', '중복 확인을 해 주세요.');
    }
    else if (!is_verified) {
        // alert("이메일 인증을 진행해주세요");
        set_valid(valid_mode.INVALID, 'verification_code', 'confirm_veri', '확인', 'id-veri-invalid-feedback', '이메일 인증을 진행헤주세요');
    }
    else if (pw != pw_confirm) {
        // alert("비밀번호가 일치하지 않습니다!");
        set_valid(valid_mode.INVALID, 'usr_password_confirm', 'null', null, null, null);
    }
    else {
        // 회원 등록
        const id = document.getElementById("userid").value;
        const nickname = document.getElementById("nickname").value;
        const email = document.getElementById("email").value;

        let param = new Array(nickname, id, email, pw);
        ipcRenderer.send('addNewUser', param);
    }
});