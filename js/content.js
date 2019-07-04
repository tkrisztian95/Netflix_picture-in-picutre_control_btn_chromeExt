var iconSvg = '<symbol id="pip"' +
    'viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve">' +
    '<style type="text/css">' +
    '.st0{fill:#FFFFFF;}' +
    '</style>' +
    '<g id="XMLID_6_">' +
    '<path id="XMLID_11_" class="st0" d="M66.7,45.3H45.3v16h21.3V45.3z M77.3,66.7V29.3c0-2.9-2.4-5.3-5.3-5.3H24' +
    '   c-2.9,0-5.3,2.3-5.3,5.3v37.4c0,2.9,2.4,5.3,5.3,5.3h48C74.9,72,77.3,69.6,77.3,66.7z M72,66.7H24V29.3h48V66.7z"/>' +
    '</g>' +
    '</symbol>';

var toggleBtnHtml = '<button id="custom-pip-btn" ' +
    'class="touchable PlayerControls--control-element ' +
    'nfp-button-control default-control-button " ' +
    'tabindex="0" ' +
    'role="button" ' +
    'aria-label="Picture-in-picture">' +
    '<svg class="svg-icon" focusable="false"><use filter="" xlink:href="#pip"></use></svg>' +
    '</button>';

function insertPictureInPictureBtn(controlRow) {
    var elementExists = window.document.getElementById("custom-pip-btn");
    if (!elementExists) {
        controlRow.insertAdjacentHTML('beforeend', toggleBtnHtml);
        let video = document.querySelector('video');
        var togglePipBtn = window.document.getElementById("custom-pip-btn");
        togglePipBtn.addEventListener("click", async function (event) {
            togglePipBtn.disabled = true; //disable toggle button while the event occurs
            try {
                // If there is no element in Picture-in-Picture yet, request for it
                if (video !== document.pictureInPictureElement) {
                    await video.requestPictureInPicture();
                }
                // If Picture-in-Picture already exists, exit the mode
                else {
                    await document.exitPictureInPicture();
                }

            } catch (error) {
                console.log(`Error! ${error}`);
            } finally {
                togglePipBtn.disabled = false; //enable toggle button after the event
            }
        });
        togglePipBtn.addEventListener("mouseover", async function (event) {
            var togglePipBtn = window.document.getElementById("custom-pip-btn");
            if (togglePipBtn) {
                togglePipBtn.classList.add("PlayerControls--control-element-active");
                togglePipBtn.setAttribute("style", "transform: scale(1.2);");
            }
        });
        togglePipBtn.addEventListener("mouseleave", async function (event) {
            var togglePipBtn = window.document.getElementById("custom-pip-btn");
            if (togglePipBtn) {
                togglePipBtn.classList.remove("PlayerControls--control-element-active");
                togglePipBtn.removeAttribute("style");
            }
        });

        video.addEventListener('enterpictureinpicture', function (event) {
            console.log('Entered PiP');
            pipWindow = event.pictureInPictureWindow;
            console.log(`Window size -  \n Width: ${pipWindow.width} \n Height: ${pipWindow.height}`); // get the width and height of PiP window
        });

        video.addEventListener('leavepictureinpicture', function (event) {
            console.log('Left PiP');
            togglePipButton.disabled = false;
        });

    }
}

function checkDOMChange() {
    // check for any new element being inserted here,
    // or a particular node being modified
    var svgDefs = window.document.querySelector('#appMountPoint > div > div > svg > defs');
    if (svgDefs) {
        var elementExists = window.document.getElementById("pip");
        if (!elementExists) {
            svgDefs.insertAdjacentHTML('beforeend', iconSvg);
        }
    }
    var controlRow = window.document.querySelector("#appMountPoint > div > div > div > div > div > div.nfp.AkiraPlayer > div > div.PlayerControlsNeo__layout.PlayerControlsNeo__layout--inactive > div > div.PlayerControlsNeo__core-controls > div.PlayerControlsNeo__bottom-controls.PlayerControlsNeo__bottom-controls--faded > div.PlayerControlsNeo__button-control-row");
    if (controlRow) {
        insertPictureInPictureBtn(controlRow);
    }
    // call the function again after 100 milliseconds
    setTimeout(checkDOMChange, 100);
}

checkDOMChange();
