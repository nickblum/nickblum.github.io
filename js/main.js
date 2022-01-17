$(function(){
    $( '#demoDuration, #demoRequired' ).on('click', function(){
        displayDemo(this.id)
    });
    $('#demoDuration').click();
});

function displayDemo(demoID){
    
    var $demoBox = $('#demoBox');
    $demoBox.empty();

    // underline the
    $('.demo-button').removeClass('nav-active');
    $('#'+demoID).addClass('nav-active')


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

function demoRequired($demoBox){
    var $demoLink = $( '<div class="demo-row">' ).append(
        $('<a class="demo-link" href="https://github.com/nickblum/required_js/">').html('[source]')
    );
    var $demoRow1 = $( '<div id="demoDurationRow" class="demo-row">' ).append(
        $('<input id="txt1" placeholder="#txt1">')
    );
    var $demoCode1 = $('<code>').html('// Basic requirement<br>'
        +"var key = 'txt1';<br>"
        +"reqStruct[key] = {<br>"
        +"&emsp;field:[addReq(key, key)]<br>"
        +"};"
    );
    var $subsection1 = $('<div class="section-row">').append( $demoRow1, $demoCode1 );

    var $demoRow2 = $( '<div id="demoDurationRow" class="demo-row">' ).append(
        $('<label>').append($('<input id="chk1" type="checkbox">')).append(document.createTextNode('Chk1')),
        $('<br>'),
        $('<label>').append($('<input id="chk2" type="checkbox">')).append(document.createTextNode('Chk2')),
        $('<br>'),
        $('<label>').append($('<input id="chk3" type="checkbox">')).append(document.createTextNode('Chk3'))
    );
    var $demoCode2 = $('<code>').html('// Alternate requirements<br>'
        +"var key, id = 'chk1';<br>"
        +"reqStruct[key] = {<br>"
        +"&emsp;field:[<br>"
        +    "&emsp;&emsp;addReq(id,key),<br>"
        +    "&emsp;&emsp;addReq('chk2',key),<br>"
        +    "&emsp;&emsp;addReq('chk3',key) ]<br>"
        +"}"
    );
    var $subsection2 = $('<div class="section-row">').append( $demoRow2, $demoCode2 );

    var $demoRow3 = $( '<div id="demoDurationRow" class="demo-row">' ).append(
        $('<label>').append($('<input id="parent1" type="checkbox">')).append(document.createTextNode('Parent1')),
        $('<br>'),
        $('<label>').append($('<input id="child1" placeholder="child1">'))
    );
    var $demoCode3 = $('<code>').html('// Dependent requirements<br>'
    +"var id = 'parent1', key = id;<br>"
    +"reqStruct[key] = {<br>"
    +    "&emsp;field:[	addReq(id,key) ],<br>"
    +    "&emsp;trigger:[{<br>"
    +        "&emsp;&emsp;field:[	addReq('child1',key) ],<br>"
    +         "&emsp;&emsp;depend:[ addReq(id,key) ] <br>"
    +    "&emsp;}]<br>" 
    +"};<br>"
    );
    var $subsection3 = $('<div class="section-row">').append( $demoRow3, $demoCode3 );

    $demoBox.append( $demoLink, $subsection1, $subsection2, $subsection3);

    REQ.init();
    
}