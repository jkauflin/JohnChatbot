/*==============================================================================
 * (C) Copyright 2019 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: Client-side JS functions and logic for JohnBot2
 * 				Functionality related to the manual controls on the web page
 *----------------------------------------------------------------------------
 * Modification History
 * 2019-02-10 JJK 	Initial version (moved from main)
 * 2019-03-30 JJK	Added keyborad arrow keys for motor control
 *============================================================================*/
var manualControls = (function () {
	'use strict';  // Force declaration of variables before use (among other things)
	//=================================================================================================================
	// Private variables for the Module
	var isTouchDevice = false;
	var headPos = 0;
	var armPos = 0;
	var motorPos = 0;
	var forwardPush = false;
    var backwardPush = false;
    var rotateLeftPush = false;
    var rotateRightPush = false;

	//=================================================================================================================
	// Variables cached from the DOM
	var $document = $(document);

	var $ForwardButton = $document.find("#ForwardButton");
	var $BackwardButton  = $document.find("#BackwardButton");
	var $RotateLeftButton = $document.find("#RotateLeftButton");
	var $RotateRightButton = $document.find("#RotateRightButton");
	var $EyeButton = $document.find("#EyeButton");
	var $VoiceButton = $document.find("#VoiceButton");
	var $MotorSpeed = $document.find("#MotorSpeed");
	var $ArmPosition = $document.find("#ArmPosition");
	var $HeadPosition = $document.find("#HeadPosition");

	//=================================================================================================================
	// Bind events
	isTouchDevice = 'ontouchstart' in document.documentElement;

	$(document).on("keydown", function(e) {
        switch (e.which) {
			case 38:
				if (!forwardPush) {
					//console.log("up pressed");
					forwardPushed();
				}
                break;
			case 40:
				if (!backwardPush) {
					//console.log("down pressed");
					backwardPushed();
				}
                break;
            case 37:
				if (!rotateLeftPush) {
					//console.log("left pressed");
					rotateLeftPushed();
				}
                break;
			case 39:
				if (!rotateRightPush) {
					//console.log("right pressed");
					rotateRightPushed();
				}
                break;
        }
    });
	$(document).on("keyup", function(e) {
        switch (e.which) {
            case 38:
				//console.log("up up");
				forwardReleased();
                break;
            case 40:
				//console.log("down up");
				backwardReleased();
                break;
            case 37:
				//console.log("left up");
				rotateLeftReleased();
                break;
            case 39:
				//console.log("right up");
				rotateRightReleased();
                break;
        }
    });

	$ForwardButton
		.mousedown(function () {
			if (!isTouchDevice) { forwardPushed(); }
		})
		.mouseup(function () {
			if (!isTouchDevice) { forwardReleased(); }
		})
		.on('touchstart', function () {
			if (isTouchDevice) { forwardPushed(); }
		})
		.on('touchend', function () {
			if (isTouchDevice) { forwardReleased(); }
		});

	$BackwardButton
		.mousedown(function () {
			if (!isTouchDevice) { backwardPushed(); }
		})
		.mouseup(function () {
			if (!isTouchDevice) { backwardReleased(); }
		})
		.on('touchstart', function () {
			if (isTouchDevice) { backwardPushed(); }
		})
		.on('touchend', function () {
			if (isTouchDevice) { backwardReleased(); }
		});

	$RotateLeftButton
		.mousedown(function () {
			if (!isTouchDevice) { rotateLeftPushed(); }
		})
		.mouseup(function () {
			if (!isTouchDevice) { rotateLeftReleased(); }
		})
		.on('touchstart', function () {
			if (isTouchDevice) { rotateLeftPushed(); }
		})
		.on('touchend', function () {
			if (isTouchDevice) { rotateLeftReleased(); }
		});

	$RotateRightButton
		.mousedown(function () {
			if (!isTouchDevice) { rotateRightPushed(); }
		})
		.mouseup(function () {
			if (!isTouchDevice) { rotateRightReleased(); }
		})
		.on('touchstart', function () {
			if (isTouchDevice) { rotateRightPushed(); }
		})
		.on('touchend', function () {
			if (isTouchDevice) { rotateRightReleased(); }
		});

	$EyeButton
		.mousedown(function () {
			if (!isTouchDevice) { eyePushed(); }
		})
		.mouseup(function () {
			if (!isTouchDevice) { eyeReleased(); }
		})
		.on('touchstart', function () {
			if (isTouchDevice) { eyePushed(); }
		})
		.on('touchend', function () {
			if (isTouchDevice) { eyeReleased(); }
		});

	$VoiceButton
		.mousedown(function () {
			if (!isTouchDevice) { voicePushed(); }
		})
//		.mouseup(function () {
//			if (!isTouchDevice) { voiceReleased(); }
//		})
		.on('touchstart', function () {
			if (isTouchDevice) { voicePushed(); }
		})
//		.on('touchend', function () {
//			if (isTouchDevice) { voiceReleased(); }
//		});

	$MotorSpeed.slider({
		reversed: true
	})
		.on("slide", function (slideEvt) {
			//$("#ex6SliderVal").text(slideEvt.value);
			//console.log("slider value = "+slideEvt.value);
			if (slideEvt.value != motorPos) {
				main.sendCommand('{"motorSpeed" : ' + slideEvt.value + '}');
				motorPos = slideEvt.value;
			}
		})
		.on("slideStop", function (slideEvt) {
			//$("#ex6SliderVal").text(slideEvt.value);
			//console.log("slider value = "+slideEvt.value);
			main.sendCommand('{"motorSpeed" : ' + slideEvt.value + '}');
		});

	$ArmPosition.slider({
		reversed: true
	})
		.on("slide", function (slideEvt) {
			//$("#ex6SliderVal").text(slideEvt.value);
			//console.log("slider value = "+slideEvt.value);
			if (slideEvt.value != armPos) {
				main.sendCommand('{"armPosition" : ' + slideEvt.value + '}');
				armPos = slideEvt.value;
			}
		})
		.on("slideStop", function (slideEvt) {
			//$("#ex6SliderVal").text(slideEvt.value);
			//console.log("slider value = "+slideEvt.value);
			main.sendCommand('{"armPosition" : ' + slideEvt.value + '}');
		});

	$HeadPosition.slider({
	})
		.on("slide", function (slideEvt) {
			if (slideEvt.value != headPos) {
				//console.log("Head slider value = "+slideEvt.value);
				main.sendCommand('{"headPosition" : ' + slideEvt.value + '}');
				headPos = slideEvt.value;
			}
		})
		.on("slideStop", function (slideEvt) {
			//console.log("sliderStop value = "+slideEvt.value);
			main.sendCommand('{"headPosition" : ' + slideEvt.value + '}');
		});


	//=================================================================================================================
	// Module methods

	function forwardPushed() {
		if (!forwardPush) {
			//console.log("FORWARD Pushed");
			main.sendCommand('{"moveDirection" : "F","move" : 1}');
			forwardPush = true;
		}
	}
	function forwardReleased() {
		//$("#logMessage").html("EYES - Released");
		main.sendCommand('{"move" : 0}');
		forwardPush = false;
	}

	function backwardPushed() {
		if (!backwardPush) {
			//console.log("BACKWARD Pushed");
			main.sendCommand('{"moveDirection" : "R","move" : 1}');
			backwardPush = true;
		}
	}
	function backwardReleased() {
		main.sendCommand('{"move" : 0}');
		backwardPush = false;
	}

	function rotateLeftPushed() {
		if (!rotateLeftPush) {
			main.sendCommand('{"rotateDirection" : "L","rotate" : 1}');
			rotateLeftPush = true;
		}
	}
	function rotateLeftReleased() {
		main.sendCommand('{"rotate" : 0}');
		rotateLeftPush = false;
	}

	function rotateRightPushed() {
		if (!rotateRightPush) {
			main.sendCommand('{"rotateDirection" : "R","rotate" : 1}');
			rotateRightPush = true;
		}
	}
	function rotateRightReleased() {
		main.sendCommand('{"rotate" : 0}');
		rotateRightPush = false;
	}

	function eyePushed() {
		main.sendCommand('{"eyes" : 1}');
	}
	function eyeReleased() {
		main.sendCommand('{"eyes" : 0}');
	}

	function voicePushed() {
		main.sayAndAnimate("Hello, this is my voice");
	}

	//=================================================================================================================
	// This is what is exposed from this Module
	return {
	};

})(); // var manualControls = (function(){
