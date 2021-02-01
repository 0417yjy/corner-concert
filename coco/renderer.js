const ipcRenderer = require('electron').ipcRenderer;

// check if server is ready
ipcRenderer.send('checkServer', {});

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
        default:
            console.log(functionName + 'is not implemented!');
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

// --------------------------------------------- 모달 스크립트 ----------------------------------------------
const modal_type = Object.freeze({ YESNO: 0, OK: 1, FORM: 2 });
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
        case modal_type.FORM:
            modal = document.getElementById('form-modal');
            break;
    }

    // 모달 내용 변경
    modal.querySelector('.modal-title').innerHTML = modal_header;
    if (mode == modal_type.FORM) {
        // modal.querySelector('#ti_modal_input').setAttribute('placeholder', modal_body);
        if (modal_body.html) {
            // contents에서 직접 html을 명시한 경우
            modal.querySelector('.modal-body').innerHTML = modal_body.contents;
        } else {
            // contents에서 form input 객체들의 리스트를 넘겨준 경우 (미구현)
        }
    } else {
        modal.querySelector('.modal-body').innerHTML = modal_body;
    }

    // 모달 보이기
    $('#' + modal.id).modal('show');
}

// --------------------------------------------- 화면 전환 스크립트 ----------------------------------------------
const div_ids = ['login-page', 'register-page', 'main-page'];
function change_display_to(id) {
    // 모든 div 숨기기
    for (let i = 0; i < div_ids.length; i++) {
        $('#' + div_ids[i]).hide();
    }

    // 선택한 div만 표시하기
    $('#' + id).show();
}

// --------------------------------------------- 로그인 화면 스크립트 --------------------------------------------
var user_data = {
    mode: null, // 회원은 1, 비회원은 2
    id: null,
    nickname: null,
    email: null,
    bio: null
}
var token = "";

document.getElementById('goto_register').addEventListener("click", async (event) => {
    change_display_to('register-page');
});


document.getElementById('non_member_login').addEventListener("click", async (event) => {
    const modal_body = {
        html: true,
        contents: `
        <input type="text" class="form-control" id="nonmember_nickname" placeholder="">
        `
    }
    show_modal(modal_type.FORM, '비회원 로그인', modal_body);
    document.getElementById("modal_form").addEventListener("submit", async (event) => {
        event.preventDefault();
        $('#form-modal').modal('hide');
        const inserted_nickname = document.getElementById('nonmember_nickname').value;
        check_login({
            success: true,
            user_data: {
                id: null,
                nickname: inserted_nickname,
                email: null,
                bio: null
            }
        });
    });
});

document.getElementById("login").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id_input = document.getElementById('login_id').value;
    const pw_input = document.getElementById('login_pw').value;
    // 로그인 시도
    // const param = new Array(id_input, pw_input);
    const param = {
        id: id_input,
        pw: pw_input
    }
    ipcRenderer.send('tryLogin', param);
});

function check_login(arg) {
    // console.log(arg);
    console.log(arg.message);

    if (arg.success) {
        // 로그인 성공
        token = arg.token;
        user_data.id = arg.user_data.id;
        user_data.nickname = arg.user_data.nickname;
        user_data.email = arg.user_data.email;
        user_data.bio = arg.user_data.bio;

        /*
        show_modal(modal_type.OK, "로그인 성공!", `
        토큰: ` + token + ` <br>
        ID: ` + user_data.id + ` <br>
        닉네임: ` + user_data.nickname + ` <br>
        이메일: ` + user_data.email + ` <br>
        상태메시지: ` + user_data.bio + ` <br>
        `);
        */
       
        var nkname = user_data.nickname;
        document.getElementById("show_nickname").innerHTML = nkname;
        change_display_to('main-page');
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
    const param = {
        email: email,
        code: code
    }

    if (code) {
        ipcRenderer.send('confirmveri', param);
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

        let param = {
            id: id,
            nickname: nickname,
            email: email,
            pw: pw
        }
        ipcRenderer.send('addNewUser', param);
    }
});

// ---------------------------------------- 메인 화면 버튼 클릭 스크립트 --------------------------------------
document.getElementById('create_room').addEventListener("click", async (event) => {
    const modal_body = {
        html: true,
        contents: `
        <p> 최대 인원 수 &nbsp;
        <select id="people">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4" selected>4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        </select>
        </p>
  
        <p> 권한 부여 &nbsp; &nbsp; &nbsp;
        <!-- <label><input type="checkbox" value="entire"> 전체</label>
        <label><input type="checkbox" value="record"> 녹음</label> -->
        </p>
        `
    }
  
    show_modal(modal_type.FORM, '합주실', modal_body);
    document.getElementById("modal_form").addEventListener("submit", async (event) => {
        event.preventDefault();
        $('#form-modal').modal('hide');
  
       // window.open("room.html", "",'fullscreen=yes', "");
    });
  });


document.getElementById('join_room').addEventListener("click", async (event) => {
    const modal_body = {
        html: true,
        contents: `
        <input type="text" class="form-control my-3" id="room_num">
        `
    }
    show_modal(modal_type.FORM, '합주실 검색', modal_body);
    document.getElementById("modal_form").addEventListener("submit", async (event) => {
        event.preventDefault();
        $('#form-modal').modal('hide');
        //$('#room_num').get(0).focus();

        const inserted_roomnumber = document.getElementById('room_num').value;
    });
});

// --------------------------------------------- 프로필 사진 변경 스크립트 ------------------------------------------
$(function () {
    $('#btn-upload').click(function (e) {
        e.preventDefault();
        $('#file').click();
    });

});

document.getElementById("file").addEventListener("change", function(event) {
    var origin_img = document.getElementById("file").value.split('\\');
    var filename = origin_img[origin_img.length - 1];

    var change_img = 'icons\\' + filename;
    //alert(change_img);
    document.getElementById("btn-upload").src = change_img;
  });

