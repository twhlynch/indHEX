const hexOutput = document.getElementById('hex').childNodes[1];
const textOutput = document.getElementById('text').childNodes[1];
const lineOutput = document.getElementById('lines').childNodes[1];

var activeHex = true;

window.addEventListener('dragover', handleDragOver, false);
window.addEventListener('drop', handleFileDrop, false);
window.addEventListener("mouseout", handleLeave, false);
window.addEventListener("mouseover", handleHover, false);
window.addEventListener("click", handleClick, false);
window.addEventListener("keydown", handleKey, false);

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function handleFileDrop(event) {
    event.preventDefault();

    const files = event.dataTransfer.files;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const hexArray = Array.from(byteArray, byte => byte.toString(16).padStart(2, '0'));
        
        let lineVal = 0;
        for (let i = 0; i < byteArray.length; i++) {
            const byteValue = byteArray[i];
            const hexValue = hexArray[i];
            const strValue = String.fromCharCode(byteValue);
            
            if (i % 16 == 0) {
                const lineElement = document.createElement('span');
                lineElement.innerText  = lineVal.toString(16).padStart(8, '0').toUpperCase();
                lineVal += 16;
                lineOutput.appendChild(lineElement);
            }

            const hexElement = document.createElement('span');
            hexElement.innerText = hexValue.toUpperCase();
            hexOutput.appendChild(hexElement);

            const textElement = document.createElement('span');
            textElement.innerText = strValue;
            if (byteValue >= 0 && byteValue < 32) {
                textElement.className = 'lf';
                textElement.innerText = " ";
            }
            textOutput.appendChild(textElement);
        }
        textOutput.children[0].id = 'selected-text';
        hexOutput.children[0].id = 'selected-hex';
    };

    reader.readAsArrayBuffer(file);
}

function handleHover(event) {
    if (event.target.parentNode.parentNode.id == "hex") {
        event.target.style.background = '#0ff3';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].style.background = '#0ff3';
    } else if (event.target.parentNode.parentNode.id == "text") {
        event.target.style.background = '#0ff3';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        hexOutput.children[index].style.background = '#0ff3';
    }
}

function handleLeave(event) {
    if (event.target.parentNode.parentNode.id == "hex") {
        event.target.style.background = null;
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].style.background = null;
    } else if (event.target.parentNode.parentNode.id == "text") {
        event.target.style.background = null;
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        hexOutput.children[index].style.background = null;
    }
}

function handleClick(event) {
    if (event.target.parentNode.parentNode.id == "hex") {
        activeHex = true;
        document.getElementById('selected-hex').id = null;
        document.getElementById('selected-text').id = null;
        event.target.id = 'selected-hex';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].id = 'selected-text';
    } else if (event.target.parentNode.parentNode.id == "text") {
        activeHex = false;
        document.getElementById('selected-text').id = null;
        document.getElementById('selected-hex').id = null;
        event.target.id = 'selected-text';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        hexOutput.children[index].id = 'selected-hex';
    }
}

function handleKey(event) {
    event.preventDefault();
    if (activeHex) {
        var selected = document.getElementById('selected-hex');
        if ("1234567890abcdef".includes(event.key) && !" ".includes(event.key)) {
            if (selected.getAttribute('data-type') == '1') {
                selected.innerText += event.key;
                selected.setAttribute('data-type', '0');
                let index =  Array.prototype.indexOf.call(selected.parentNode.children, selected);
                let byteVal = parseInt(selected.innerText, 16);
                let text = String.fromCharCode(byteVal);
                if (byteVal >= 0 && byteVal < 32) {
                    textOutput.children[index].className = 'lf';
                    text = " ";
                }
                textOutput.children[index].innerText = text;
                selected.parentNode.children[index + 1].click();
            } else {
                selected.innerText = event.key;
                selected.setAttribute('data-type', '1');
            }
        }
    } else {
        if (event.key.length == 1) {
            var selected = document.getElementById('selected-text');
            selected.innerText = event.key;
            let index =  Array.prototype.indexOf.call(selected.parentNode.children, selected);

            let byteVal = selected.innerText.charCodeAt(0);
            let hex = byteVal.toString(16).padStart(2, '0');

            hexOutput.children[index].innerText = hex;
            selected.parentNode.children[index + 1].click();
        }
    }
    
}