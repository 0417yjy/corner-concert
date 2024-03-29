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

//사이드바 숨김버튼
$("#side_bar_btn").off("click").on('click', function () {
    $("#side_bar").toggle();
    $("#room_area").toggleClass("col-9");
    $("#room_area").toggleClass("col-12");
});

//bpm 조절버튼
$("#bpm-down").off('click').on('click',function(){
    let bpm_value=$("#bpm-indicator").val();
    $("#bpm-indicator").val(Number(bpm_value)-1);
});

$("#bpm-up").off().on('click', function () {
    let bpm_value = $("#bpm-indicator").val();
    $("#bpm-indicator").val(Number(bpm_value)+1);
});