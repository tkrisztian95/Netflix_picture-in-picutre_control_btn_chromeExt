var $video;
var $playerControlRow;
var PIP_BTN_SVG = '<symbol id="pip"' +
    'viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve">' +
    '<style type="text/css">' +
    '.st0{fill:#FFFFFF;}' +
    '</style>' +
    '<g id="XMLID_6_">' +
    '<path id="XMLID_11_" class="st0" d="M66.7,45.3H45.3v16h21.3V45.3z M77.3,66.7V29.3c0-2.9-2.4-5.3-5.3-5.3H24' +
    '   c-2.9,0-5.3,2.3-5.3,5.3v37.4c0,2.9,2.4,5.3,5.3,5.3h48C74.9,72,77.3,69.6,77.3,66.7z M72,66.7H24V29.3h48V66.7z"/>' +
    '</g>' +
    '</symbol>';

var $togglePipBtn = $('<button id="custom-pip-btn" ' +
    'class="touchable PlayerControls--control-element ' +
    'nfp-button-control default-control-button " ' +
    'tabindex="0" ' +
    'role="button" ' +
    'aria-label="Picture-in-picture">' +
    '<svg class="svg-icon" focusable="false"><use filter="" xlink:href="#pip"></use></svg>' +
    '</button>');

$togglePipBtn.mouseover(async function (event) {
    $togglePipBtn.addClass("PlayerControls--control-element-active");
    $togglePipBtn.attr("style", "transform: scale(1.2);");
});

$togglePipBtn.mouseleave(async function (event) {
    $togglePipBtn.removeClass("PlayerControls--control-element-active");
    $togglePipBtn.removeAttr("style");
});

$togglePipBtn.click(async function (event) {
    $togglePipBtn.disabled = true; //disable toggle button while the event occurs
    try {
        // If there is no element in Picture-in-Picture yet, request for it
        if ($video !== document.pictureInPictureElement) {
            await $video[0].requestPictureInPicture();
        }
        // If Picture-in-Picture already exists, exit the mode
        else {
            await document.exitPictureInPicture();
        }

    } catch (error) {
        console.log(`Error! ${error}`);
    } finally {
        $togglePipBtn.disabled = false; //enable toggle button after the event
    }
});

function addTogglePipBtn() {
    if ('pictureInPictureEnabled' in document) {
        var svgDefs = window.document.querySelector('#appMountPoint > div > div > svg > defs');
        svgDefs.insertAdjacentHTML('beforeend', PIP_BTN_SVG);

        var startTime = new Date().getTime();
        var checkBtnControlRowExist = setInterval(function () {
            //Return after 1 min load time left
            if (new Date().getTime() - startTime > 60000) {
                clearInterval(checkBtnControlRowExist);
                return;
            }

            $video = $('video');
            $playerControlRow = $('.PlayerControlsNeo__button-control-row');
            if ($playerControlRow.length && $video.length) {

                $playerControlRow.append($togglePipBtn);

                $video.bind('enterpictureinpicture', function (event) {
                    console.log('Netflix watch entered PiP');
                });

                $video.bind('leavepictureinpicture', function (event) {
                    console.log('Netflix watch left PiP');
                    $togglePipBtn.disabled = false;
                });

                clearInterval(checkBtnControlRowExist);
            }

        }, 100); // check every 100ms
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'url_changed!') {
            try {
                document.exitPictureInPicture();
            } catch (error) {
                console.log(`Error! ${error}`);
            } finally {
                addTogglePipBtn();
            }
        }
    });

$(document).ready(function () {
    addTogglePipBtn();
});


