var REQ = ( function () {
	var reqStruct = {};

	function addReq(id,grp){
        var el = document.getElementById(id);
		if ( !el.grp ){
			el.grp = grp;
			validateElement(el);
			$(el).on('click keyup blur',function(){
				validateElement(this);
				validateGroup(reqStruct[this.grp]);
			});
		}
        return el;
    }

	function isInput(el){
		return (el.type && (el.type=='radio'||el.type=='checkbox'||el.type=='hidden'));
	}

	function findIncomplete( group ){
		if ( group.isRequired ) {
			return group.field[0];
		} else if ( group.trigger && group.trigger.length ) {
			var field = false;
			for ( var i = 0; i < group.trigger.length; i++ ){
				if ( field = findIncomplete( group.trigger[i] )){
					return field;
				}
			}
		} else {
			return false;
		}
	}

    function paintReq( group ){
        for ( var i = group.field.length; i--; ){
        	if ( !group.field[i] ) {//skip this loop iteration
        		continue;
        	} else if ( isInput(group.field[i]) ) {// if radio or checkbox, paint parent
        		 //group.field[i].parentNode.style.backgroundColor = ( group.isRequired ? '#ffc' : '' );
        		$( group.field[i].parentNode )[ group.isRequired ? 'addClass' : 'removeClass' ]('rbtn_req');
        	} else {// text input or textarea, paint background
        		//group.field[i].style.backgroundColor = ( group.isRequired ? '#ffc' : '' );
        		$( group.field[i] )[ group.isRequired ? 'addClass' : 'removeClass' ]('rbtn_req');
        	}
        }
    }

    function validateElement(el){
        if ( isInput(el) && el.type != 'hidden' ) {
            el.valid = el.checked;
        } else {
            el.valid = ( el.value.length ? true : false );
        }
        return el.valid;
    }

    function validateGroup(group){
		group.isRequired = ( !validateSubgroup( group.field ) // field is NOT completed
			                    && ( !group.depend || !group.depend.length || validateSubgroup( group.depend ) ) );//dependency is met or doesn't exist
        paintReq(group);

        if ( typeof group.trigger !== 'undefined' && group.trigger.length ) {
			for ( var i = group.trigger.length; i--; ) {
				validateGroup( group.trigger[i] );
			}
		}
    }

	function validateSubgroup(elArr){
		var isValid = true;

		if (typeof elArr !== 'undefined' && elArr.length ) {
			isValid = false;
			for ( var i = elArr.length; i--; ){
				if ( validateElement( elArr[i] ) ) {
					return true;
				}
			}
		}
		return isValid;
	}

	return {
		showIncomplete: function(){
			var $buttonBox = $( '#csnButtonBox' );
			var firstIncomplete = false;
			$buttonBox.find('input').prop('disabled',false);

			for ( var key in reqStruct ){
                if ( firstIncomplete = findIncomplete( reqStruct[key] ) ) {
            		var $scrollTarget = $( firstIncomplete );
            		var pulseTarget = firstIncomplete;
            		if ( isInput( firstIncomplete ) ){
            			pulseTarget = firstIncomplete.parentNode;
            			$scrollTarget = $(( firstIncomplete.type == 'hidden' ? firstIncomplete.parentNode : firstIncomplete ));
            		}
                    /*
                    $("html").animate({ scrollTop: $scrollTarget.offset().top - 200 }, 600, function(){
            			EMR.UTIL.pulseWarning( pulseTarget );
                    } );
                    */
            		break;
				}
            }

			return firstIncomplete;
		},
		init: function() {
			// may need to improve search efficiency with
            /*
            var $box = $('.csnblock-container');

			// INDIVIDUALS PRESENT
			$box.find( 'input[id^="csnblock_present_others"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var key = this.id;

				reqStruct[key] = {
					field:[	addReq(key,key),
							addReq('csnblock_present_patient'+noteID,key) ],
					trigger:[
						{	field:[	addReq('csnblock_present_others_txt'+noteID,key)],
							depend:[ addReq(key,key)]
						}
					]
	            };
			} );

            
			// PATIENT REPORT OF PROGRESS
			$box.find( 'textarea[id^="csnblock_patient_report_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// PATIENT CONDITION (FOR NON RBHS)
			$box.find( 'input[id^="csnblock_cnd_mood"][id$="_yes"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var key = this.id;

				// mood/affect
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_mood'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_mood_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// thought process
				var key = 'csnblock_cnd_thoughts'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_thoughts'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_thoughts_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// motivation
				var key = 'csnblock_cnd_motivation'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_motivation'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_motivation_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// behavior
				var key = 'csnblock_cnd_behavior'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_behavior'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_behavior_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// medical condition
				var key = 'csnblock_cnd_medical'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_medical'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_medical_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// substance
				var key = 'csnblock_cnd_substance'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_cnd_substance'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_cnd_substance_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

			} );

			// PATIENT CONDITION (FOR RBHS)
			$box.find( 'input[id^="csnblock_rbhs_mood"][id$="_yes"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var key = this.id;

				// mood/affect
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_rbhs_mood'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_rbhs_mood_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };

				// behavior
				var key = 'csnblock_rbhs_behavior'+noteID+'_yes'
				reqStruct[key] = {
	                field:[	addReq(key,key),
	                		addReq('csnblock_rbhs_behavior'+noteID+'_no',key) ],
	                trigger:[
						{	field:[	addReq('csnblock_rbhs_behavior_txt'+noteID,key)],
							depend:[ addReq(key,key)] } ] };
			} );

			// RISK ASSESSMENT
			$box.find( 'input[id^="csnblock_si_thoughts"][id$="_yes"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var key = this.id;
				var key2 = 'csnblock_si_behavior'+noteID+'_yes';

				// break this out since it's triggered by two separate groups (below)
				// ... not sure this is a good decision? Hm.
				var trigStruct = {	field:[	addReq('csnblock_si_review_protocols'+noteID,key),
					                		addReq('csnblock_si_safety_plan'+noteID,key),
					                		addReq('csnblock_si_init_hospitalization'+noteID,key),
					                		addReq('csnblock_si_other_txt'+noteID,key),
					                		addReq('csnblock_si_update_safety_plan'+noteID,key),
					                		addReq('csnblock_si_review_safety_plan'+noteID,key)],
									depend:[addReq(this.id,key),
											addReq(key2,key2)] }// CAREFUL! NEED THE RIGHT KEY FOR THIS ONE!

				// "Suicidal Thoughts" and sub requirements
				reqStruct[key] = {
	                field:[	addReq(this.id,key),
	                		addReq('csnblock_si_thoughts'+noteID+'_no',key) ],
	                trigger:[
            			{	field:[	addReq('csnblock_si_method'+noteID+'_yes',key),
            						addReq('csnblock_si_method'+noteID+'_no',key) ],
							depend:[addReq(this.id,key)]
						},
						{ 	field:[	addReq('csnblock_si_plan'+noteID+'_yes',key),
									addReq('csnblock_si_plan'+noteID+'_no',key)],
							depend:[addReq(this.id,key)]
						},
						{ 	field:[	addReq('csnblock_si_noplan'+noteID+'_yes',key),
									addReq('csnblock_si_noplan'+noteID+'_no',key)],
							depend:[addReq(this.id,key)]
						},
						trigStruct
					]
	            };

				// "Suicidal Behavior" and sub requirements
				reqStruct[key2] = {
	                field:[	addReq(key2,key2),
	                		addReq('csnblock_si_behavior'+noteID+'_no',key2)],
	                trigger:[
            			{	field:[	addReq('csnblock_si_behavior_txt'+noteID,key2)],
							depend:[addReq(key2,key2)]
						},
						trigStruct
					]
	            };
			} );


			// FOCUS OF SESSION
			$box.find( 'textarea[id^="csnblock_focus_txt"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var key = this.id;//key can be anything, just needs to be unique.
				var fieldArr = [addReq(this.id,key)];

				$( 'input[id^="csnblock_objective'+noteID+'"]' ).each( function(){
					fieldArr.push( addReq(this.id,key) );
				});

				reqStruct[key] = {
	                field:fieldArr
	            };
			} );

			// CONTENT OF SESSION
			$box.find( 'textarea[id^="csnblock_ci_content_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// INTERVENTIONS (POC)
			$box.find( 'textarea[id^="csnblock_intervention_txt"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				var fieldArr = [];
				var key = 'csnblock_intervention'+noteID;
				$( 'input[id^="csnblock_intervention'+noteID+'"]' ).each( function(){
					fieldArr.push( addReq(this.id,key) );
				});

				if ( fieldArr.length ){
					reqStruct[key] = {
						field:fieldArr
		            };
				}

				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };

			} );

			// THEREPEUTIC INTERVENTIONS (CPSS/H059)
			$box.find( 'textarea[id^="csnblock_int_describe_txt"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];

				var key = 'csnblock_int_informed_choices'+noteID;
				if ( $( "#" + key ).length ){
					reqStruct[key] = {
						field:[	addReq(key,key),
								addReq('csnblock_int_self_worth'+noteID,key),
								addReq('csnblock_int_self_help'+noteID,key),
								addReq('csnblock_int_make_contact'+noteID,key),
								addReq('csnblock_int_proactive_role'+noteID,key),
								addReq('csnblock_int_crisis_plan'+noteID,key),
								addReq('csnblock_int_positive_communication'+noteID,key),
								addReq('csnblock_int_ada_accomodations'+noteID,key)
						]
		            };
	            }
	            reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// RESPONSE
			$box.find( 'textarea[id^="csnblock_response_txt"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];

				var key = 'csnblock_response_cooperative'+noteID;
				if ( $( "#" + key ).length ){
					reqStruct[key] = {
						field:[	addReq('csnblock_response_attentive'+noteID,key),
								addReq('csnblock_response_cooperative'+noteID,key),
								addReq('csnblock_response_suspicious'+noteID,key),
								addReq('csnblock_response_agreeable'+noteID,key),
								addReq('csnblock_response_open'+noteID,key),
								addReq('csnblock_response_guarded'+noteID,key),
								addReq('csnblock_response_agitated'+noteID,key),
								addReq('csnblock_response_refused'+noteID,key),
								addReq('csnblock_response_aggressive'+noteID,key),
								addReq('csnblock_response_disinterested'+noteID,key),
								addReq('csnblock_response_distracted'+noteID,key)
						]
		            };
	            }

	            reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };

			} );

			// PATIENT PROGRESS/RESPONSE TO INTERVENTIONS
			$box.find( 'textarea[id^="csnblock_progress_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// ACTION PLAN
			$box.find( 'textarea[id^="csnblock_action_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// SPD RECOMMENDATIONS
			$box.find( 'textarea[id^="csnblock_spd_recommendations_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// PATIENT STATUS
			$box.find( 'textarea[id^="csnblock_spd_progress_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// DISPOSITION
			$box.find( 'textarea[id^="csnblock_ci_disposition_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// GROUP ACTIVITIES
			$box.find( 'textarea[id^="csnblock_group_activities_txt"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// PRIMARY CARE
			$box.find( 'input[type="hidden"][id^="csnblock_pc_complete"]' ).each( function(){
				reqStruct[this.id] = {
	                field:[addReq(this.id, this.id)]
	            };
			} );

			// NOTES
			$box.find( 'textarea[id^="csnblock_note_txt"]' ).each( function(){
				var noteID = (this.id).match(/\d+/)[0];
				reqStruct[this.id] = {
	                field:[	addReq(this.id, this.id),
	                		addReq("csnblock_compl_ica" + noteID, this.id) ]
	            };

			} );

			// EBP SELECT
			$box.find( 'select[id^="csnblock_ebp_id"]' ).each( function(){
				reqStruct[this.id] = { field:[addReq(this.id, this.id)] };
			} );

			// run through all required fields, paint as needed
			for ( var key in reqStruct ){
                validateGroup(reqStruct[key]);
            }
            */
		}
	}
}());
