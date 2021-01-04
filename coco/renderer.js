const ipcRenderer = require('electron').ipcRenderer;

// check if database is ready
ipcRenderer.send('db_connect', {});
ipcRenderer.on('callFunction', function (event, functionName, param) {
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
require("bootstrap");

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

// --------------------------------------------- 회원 가입 스크립트 ----------------------------------------------
let not_duplicated = false;
let is_verified = false;

function check_verified(bool) {
    // 이메일 코드 인증 함수
    is_verified = bool;
    if (bool) {
        alert("인증되었습니다.");
    } else {
        alert("잘못된 인증번호입니다.");
    }
}

function check_duplicated(bool) {
    // id 중복 확인 함수
    not_duplicated = bool;
    if (bool) {
        // 사용 가능한 id
        let btn_check_dup = document.getElementById("check_dup");
        btn_check_dup.classList.replace("btn-secondary", "btn-success");
        btn_check_dup.innerHTML = "사용 가능"
    } else {
        // 사용 불가능한 id
        btn_check_dup.classList.replace("btn-secondary", "btn-danger");
        alert("이미 존재하는 ID입니다. 다른 ID로 시도하세요.")
    }
}

function check_register(bool) {
    if (bool) {
        // 회원가입 성공
        alert("회원가입에 성공하였습니다.");
    } else {
        alert("회원가입에 실패하였습니다.");
    }
}

document.getElementById("check_dup").addEventListener("click", async (event) => {
    event.preventDefault();
    const id = document.getElementById("userid").value;
    
    if (id) {
        ipcRenderer.send('checkdup', id);
    } else {
        alert("ID를 입력해주세요.");
    }
});

document.getElementById("send_veri").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;

    if (email) {
        ipcRenderer.send('sendveri', email);
        alert("확인 코드를 이메일로 전송하였습니다.");
    } else {
        alert("이메일을 입력해주세요.");
    }
});

document.getElementById("confirm_veri").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const code = document.getElementById("verification_code").value;

    if (code) {
        ipcRenderer.send('confirmveri', [email, code]);

    } else {
        alert("인증코드를 입력해주세요.");
    }
});

document.getElementById("register").addEventListener("submit", async (event) => {
    event.preventDefault();
    const pw = document.getElementById("usr_password");
    const pw_confirm = document.getElementById("usr_passwordr_confirm");
    if (not_duplicated) {
        alert("중복 확인을 해 주세요"); // 추후 툴팁으로 바꾸면 보기 좋을 듯
    }
    else if (is_verified) {
        alert("인증코드를 입력해주세요"); // 여기도 툴팁으로 바꾸면 좋을 듯
    }
    else if (pw != pw_confirm) {
        alert("비밀번호가 일치하지 않습니다!");
    }
    else {
        // 회원 등록
        const id = document.getElementById("userid");
        const nickname = document.getElementById("nickname");
        const email = document.getElementById("email");

        param = [nickname, id, email, pw];
        ipcRenderer.send('addNewUser', param);
    }
});