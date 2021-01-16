//합주실 기능 문서

// 메트로놈의 bpm-indicator가 숫자만 입력 가능하도록
function check_num_only() {
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}

$("#metro-volume-slider").slider({
    value: 50,
    slide: function (event, ui) {
        $('#metro-volume-indicator').val(ui.value + '%');
    }
}).slider("pips", {
    first: "pip",
    last: "pip"
})
