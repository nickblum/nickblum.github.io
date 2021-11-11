$(function(){
    demoDuration
    $( '#demoDuration, #demoRequired' ).on('click', function(){
        displayDemo(this.id)
    });
});

function displayDemo(demoID){
    
    var $demoBox = $('#demoBox');
    $demoBox.empty();

    if (typeof window[demoID] === "function") {
        window[demoID]();
    }
}

function demoDuration(){
    alert('duration!');
}

function demoRequired(){
    alert('required!');
}