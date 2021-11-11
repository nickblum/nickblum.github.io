(function( $ ) {
    $.fn.durationjs = function( settings={} ) {
        var $this = $( this );
        var $lastInput;
        var settings = $.extend({
            display: 'dhm', // days hours & minues by default; must be sequential (i.e., no 'dms')
            sInc: 1,
            mInc: 15,
            hInc: 1,
            dInc: 1,
            initVal: 0, // Seconds
        }, settings );
        
        var tUnits = {
            s: { dsp: "Sec", inc: settings.sInc, val: 0, max: 60, rate: 1}, // default save value in seconds, 1 = 1
            m: { dsp: "Min", inc: settings.mInc, val: 0, max: 60, rate: 60},// 60 secs per min, ...
            h: { dsp: "Hrs", inc: settings.hInc, val: 0, max: 24, rate: 3600},
            d: { dsp: "Day", inc: settings.dInc, val: 0, max: 365, rate: 86400}
        }
        // Calculate initialiation values

        // increment value on up/down button and up/down keypress
        var actionUpDown = function($input, goUp, selectIt = false ){
            // get input unit type
            var tUnit = $input.attr('tunit');

            // get input starting value
            var newVal = parseInt($input.val(), 10);
            newVal = ( isNaN( newVal ) ? 0 : newVal );
            newVal += ( goUp ? 1 : -1 ) * tUnits[tUnit].inc; 
            
            // check if newVal is out of range for input
            // if applicable, increment/decrement sibling input
            if (  newVal <= 0 || newVal >= tUnits[tUnit].max ) {
                if ( newVal == 0 || ( newVal < 0 && $input.index() < 2 ) ){
                    newVal = "00";
                } else if ( $input.index() >= 2 ){
                    let $nextUnit = $input.prev().prev();
                    let nextUnitVal = parseInt($nextUnit.val());
                    
                    if ( newVal < 0 && nextUnitVal > 0 ) {
                        $nextUnit.val( nextUnitVal - 1 ).trigger('blur');
                        newVal = tUnits[tUnit].max - tUnits[tUnit].inc;
                    } else if ( newVal > 0 ) {
                        $nextUnit.val( nextUnitVal + 1).trigger('blur');
                        newVal = "00";
                    } else {
                        newVal = "00";
                    }
                }
            } 
            
            $input.val(newVal)[ selectIt ? 'select' : 'blur']();
            return false;
        }

        // Build the HTML inputs
        var $box = $('<div class="duration-box">');
        var inputTypes = settings.display.split("");
        inputTypes.forEach(function (unit) {
            let inputVal = (tUnits[unit].val).toString().padStart(2,'0');
            let $input = $('<input type="text" maxlength="2" class="duration duration-val">').attr('tunit',unit).val(inputVal);
            let $label = $('<label class="duration">').html( tUnits[unit].dsp )
            
            //add listeners
            $input.on('focus',function(){ 
                $lastInput = $( this );
                this.select() 
            });
            $input.on('blur',function(){ 
                if ( isNaN( this.value ) ) this.value = '00';
                this.value = this.value.toString().padStart(2,0); 
            });
            $input.on('keyup',function( e ){ 
                // remove non-integer characters
                this.value = this.value.replace(/\D/g,'');
                    
                // if up (38) or down (40) keypress, increment/decrement value
                if ( e.which == 38 || e.which == 40 ) { 
                    return actionUpDown( $(this), ( e.which == 38 ), true );
                } 
            });
            $box.append( $input, $label );
        });
        var $btnUp = $( '<input type="button" class="duration duration-updown material-icons" value="arrow_upward">' );
        var $btnDown = $( '<input type="button" class="duration duration-updown material-icons" value="arrow_downward">' );
        $box.append($btnUp,$btnDown);
        $lastInput = $box.find('.duration-val').last();
        
        // Add button listeners
        $btnUp.on('click',function(){ actionUpDown( $lastInput, true ); });
        $btnDown.on('click',function(){ actionUpDown( $lastInput, false ); });

        $this.append( $box );
    };
 
}( jQuery ));