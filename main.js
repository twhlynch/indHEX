const hexOutput = document.getElementById('hex').childNodes[1];
const textOutput = document.getElementById('text').childNodes[1];
const lineOutput = document.getElementById('lines').childNodes[1];

var activeHex = true;
var fileName = 'Untitled.txt';

window.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}, false);
window.addEventListener('drop', (event) => {
    event.preventDefault();
    loadFileToHex(event.dataTransfer.files[0]);
}, false);
window.addEventListener("mouseout", handleLeave, false);
window.addEventListener("mouseover", handleHover, false);
window.addEventListener("click", handleClick, false);
window.addEventListener("keydown", handleKey, false);
document.getElementById('file').addEventListener("change", (event) => {
    loadFileToHex(event.target.files[0]);
}, false);
document.getElementById('save').addEventListener("click", saveFile, false);
document.getElementById('open').addEventListener("click", () => {document.getElementById('file').click();}, false);

function loadFileToHex(file) {
    hexOutput.innerText = '';
    textOutput.innerText = '';
    fileName = file.name;
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
            if ((byteValue >= 0 && byteValue) < 32 || (byteValue >= 128 && byteValue < 160)) {
                textElement.className = 'lf';
                textElement.innerText = " ";
            }
            textOutput.appendChild(textElement);
        }
        textOutput.children[0].id = 'selected-text';
        hexOutput.children[0].id = 'selected-hex';
        hexOutput.children[0].click();
    };

    reader.readAsArrayBuffer(file);
}

function saveFile() {
    const bytes = [];
    const children = hexOutput.children;
    for (let i = 0; i < children.length; i++) {
        bytes.push(parseInt(children[i].innerText, 16));
    };
    const byteArray = new Uint8Array(bytes);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleHover(event) {
    let parID = event.target.parentNode.parentNode.id;
    if (parID == "hex" || parID == "text") {
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].style.background = '#0ff3';
        hexOutput.children[index].style.background = '#0ff3';
    }
}

function handleLeave(event) {
    let parID = event.target.parentNode.parentNode.id;
    if (parID == "hex" || parID == "text") {
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].style.background = null;
        hexOutput.children[index].style.background = null;
    }
}

function handleClick(event) {
    let parID = event.target.parentNode.parentNode.id;
    if (parID == "text" || parID == "hex") {
        var selectedHex = document.getElementById('selected-hex');
        var selectedText = document.getElementById('selected-text');
        var index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        if (selectedHex.innerText.length == 1) {
            selectedHex.innerText = selectedHex.innerText.padStart(2, '0');
            selectedHex.setAttribute('data-type', '0');
        }
        selectedHex.id = null;
        selectedText.id = null;
        activeHex = parID == "hex" ? true : false;
        textOutput.children[index].id = 'selected-text';
        hexOutput.children[index].id = 'selected-hex';
        getInfo(index, hexOutput.children.length);
    }
}

function handleKey(event) {
    event.preventDefault();
    var index = Array.prototype.indexOf.call(document.getElementById('selected-hex').parentNode.children, document.getElementById('selected-hex'));
    var targetOutput = activeHex ? hexOutput : textOutput;
    if (event.keyCode === 37) {
        targetOutput.children[index - 1].click();
    } else if (event.keyCode === 39) {
        targetOutput.children[index + 1].click();
    } else if (event.keyCode === 38) {
        targetOutput.children[index - 16].click();
    } else if (event.keyCode === 40) {
        targetOutput.children[index + 16].click();
    } else if (event.keyCode == 46 || event.keyCode == 8) {
        if (index + 1 < targetOutput.children.length) {
            targetOutput.children[index + 1].click();
        } else if (index != 0) {
            targetOutput.children[index - 1].click();
        }
        hexOutput.children[index].remove();
        textOutput.children[index].remove();
    } else if (event.keyCode === 45) {
        var newEl = document.createElement('span');
        newEl.innerText = "00";
        hexOutput.insertBefore(newEl, hexOutput.childNodes[index + 1]);

        var newTextEl = document.createElement('span');
        newTextEl.className = "lf";
        textOutput.insertBefore(newTextEl, textOutput.childNodes[index + 1]);

        targetOutput.children[index + 1].click();
    } else if (activeHex) {
        var selected = document.getElementById('selected-hex');
        if ("1234567890abcdef".includes(event.key) && event.key !== "") {
            if (selected.getAttribute('data-type') == '1') {
                selected.innerText += event.key.toUpperCase();;
                selected.setAttribute('data-type', '0');
                let byteVal = parseInt(selected.innerText, 16);
                let text = String.fromCharCode(byteVal);
                if ((byteVal >= 0 && byteVal) < 32 || (byteVal >= 128 && byteVal < 160)) {
                    textOutput.children[index].className = 'lf';
                    text = " ";
                } else {
                    textOutput.children[index].className = '';
                }
                textOutput.children[index].innerText = text;
                console.log(selected.parentNode.children.length, index);
                if (selected.parentNode.children.length === index + 1) {
                    var newEl = document.createElement('span');
                    newEl.innerText = "00";
                    selected.parentNode.appendChild(newEl);

                    var newTextEl = document.createElement('span');
                    newTextEl.className = "lf";
                    textOutput.appendChild(newTextEl);
                }
                selected.parentNode.children[index + 1].click();
            } else {
                selected.innerText = event.key.toUpperCase();;
                selected.setAttribute('data-type', '1');
            }
        }
    } else {
        if (event.key.length == 1) {
            var selected = document.getElementById('selected-text');
            selected.innerText = event.key;
            selected.className = '';

            let byteVal = selected.innerText.charCodeAt(0);
            let hex = byteVal.toString(16).padStart(2, '0').toUpperCase();;

            hexOutput.children[index].innerText = hex;
            if (selected.parentNode.children.length === index + 1) {
                var newEl = document.createElement('span');
                newEl.innerText = "00";
                hexOutput.appendChild(newEl);

                var newTextEl = document.createElement('span');
                newTextEl.className = "lf";
                textOutput.appendChild(newTextEl);
            }
            selected.parentNode.children[index + 1].click();
        }
    }
    var lineVal = 0;
    lineOutput.innerHTML = "";
    for (let i = 0; i < hexOutput.children.length; i++) {
        if (i % 16 == 0) {
            console.log(lineVal)
            const lineElement = document.createElement('span');
            lineElement.innerText = lineVal.toString(16).padStart(8, '0').toUpperCase();
            lineVal += 16;
            lineOutput.appendChild(lineElement);
        }
    }
}

function getInfo(index, length) {
    var hexData = "";
    for (let i = 0; i < length - index && i < 8; i++) {
        hexData += hexOutput.children[index + i].innerText;
    }
    hexData = hexData.padEnd(16, '0').toUpperCase();
    const arrayBuffer = new Uint8Array(hexData.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16);
    })).buffer;
    const byteArray = new Uint8Array(arrayBuffer);
    const byte = byteArray[0];
    const binary = byte.toString(2).padStart(8, '0');
    const char = String.fromCharCode(byte);
    const Uint8 = new Uint8Array(arrayBuffer, 0, 1)[0];
    const Uint16 = new Uint16Array(arrayBuffer, 0, 1)[0];
    const Uint32 = new Uint32Array(arrayBuffer, 0, 1)[0];
    const Uint64 = new BigUint64Array(arrayBuffer, 0, 1)[0];

    document.getElementById('name').innerText = fileName;
    document.getElementById('bytes').innerText = length+" bytes";
    document.getElementById('addr').innerText = index.toString(16).padStart(8, '0').toUpperCase();
    document.getElementById('8b').innerText = Uint8;
    document.getElementById('16b').innerText = Uint16;
    document.getElementById('32b').innerText = Uint32;
    document.getElementById('64b').innerText = Uint64;
    document.getElementById('char').innerText = char;
    document.getElementById('bin').innerText = binary;
}