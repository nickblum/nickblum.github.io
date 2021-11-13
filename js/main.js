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
        window[demoID]($demoBox);
    }
}

function demoDuration($demoBox){
    var $demoLink = $( '<div class="demo-row">' ).append(
        $('<a class="demo-link" href="https://github.com/nickblum/durationjs/">').html('[source]')
    );
    var $demoRow1 = $( '<div id="demoDurationRow" class="demo-row">' );
    var $demoCode1 = $('<code>').html('// default<br>$demoParent.durationjs();');
    var $subsection1 = $('<div class="section-row">').append( $demoRow1, $demoCode1 );

    var $demoRow2 = $( '<div id="demoDurationRow" class="demo-row">' );
    var $demoCode2 = $('<code>').html('// display hours & minutes, increment minutes by 2<br>$demoParent.durationjs({display:"hm", mInc:2});');
    var $subsection2 = $('<div class="section-row">').append( $demoRow2, $demoCode2 );

    $demoBox.append( $demoLink, $subsection1, $subsection2 );
    $demoRow1.durationjs();
    $demoRow2.durationjs({display:"hm", mInc:2});
}

function demoRequired(){
    alert('required!');
}