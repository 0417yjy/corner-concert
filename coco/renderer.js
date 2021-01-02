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
let is_verified = false;

document.getElementById("send_veri").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    
    ipcRenderer.send('sendveri', email);
    alert("확인 코드를 이메일로 전송하였습니다.");
});

document.getElementById("register").addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("userid");
    const pw = document.getElementById("usr_password");
    const pw_confirm = document.getElementById("usr_passwordr_confirm");
    const nickname = document.getElementById("nickname");
    const email = document.getElementById("email");
    const verification_code = document.getElementById("verification_code");


     
});