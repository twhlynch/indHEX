const hexOutput = document.getElementById('hex').childNodes[1];
const textOutput = document.getElementById('text').childNodes[1];
const lineOutput = document.getElementById('lines').childNodes[1];

var activeHex = true;
var fileName = 'Untitled.txt';

window.addEventListener('dragover', handleDragOver, false);
window.addEventListener('drop', handleFileDrop, false);
window.addEventListener("mouseout", handleLeave, false);
window.addEventListener("mouseover", handleHover, false);
window.addEventListener("click", handleClick, false);
window.addEventListener("keydown", handleKey, false);
document.getElementById('file').addEventListener("change", openFile, false);
document.getElementById('file-a').addEventListener("change", (event) => {openFile(event, false)}, false);
document.getElementById('save').addEventListener("click", saveFile, false);
document.getElementById('open').addEventListener("click", () => {document.getElementById('file').click();}, false);
document.getElementById('append').addEventListener("click", () => {document.getElementById('file-a').click();}, false);

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function handleFileDrop(event) {
    event.preventDefault();

    const files = event.dataTransfer.files;
    const file = files[0];
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
                lineElement.innerText = lineVal.toString(16).padStart(8, '0').toUpperCase();
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
    };

    reader.readAsArrayBuffer(file);
}

function openFile(event, clear = true) {
    if (clear) {
        hexOutput.innerText = '';
        textOutput.innerText = '';
    }
    const files = event.target.files;
    const file = files[0];
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
        if (document.getElementById('selected-hex').innerText.length == 1) {
            document.getElementById('selected-hex').innerText = document.getElementById('selected-hex').innerText.padStart(2, '0');
            document.getElementById('selected-hex').setAttribute('data-type', '0');
        }
        document.getElementById('selected-hex').id = null;
        document.getElementById('selected-text').id = null;
        event.target.id = 'selected-hex';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        textOutput.children[index].id = 'selected-text';
        getInfo(
            event.target.innerText +
            (hexOutput.children[index + 1]?.innerText ?? '00') +
            (hexOutput.children[index + 2]?.innerText ?? '00') +
            (hexOutput.children[index + 3]?.innerText ?? '00') +
            (hexOutput.children[index + 4]?.innerText ?? '00') +
            (hexOutput.children[index + 5]?.innerText ?? '00') +
            (hexOutput.children[index + 6]?.innerText ?? '00') +
            (hexOutput.children[index + 7]?.innerText ?? '00')
            , index, hexOutput.children.length);
    } else if (event.target.parentNode.parentNode.id == "text") {
        activeHex = false;
        if (document.getElementById('selected-hex').innerText.length == 1) {
            document.getElementById('selected-hex').innerText = document.getElementById('selected-hex').innerText.padStart(2, '0');
            document.getElementById('selected-hex').setAttribute('data-type', '0');
        }
        document.getElementById('selected-text').id = null;
        document.getElementById('selected-hex').id = null;
        event.target.id = 'selected-text';
        let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        hexOutput.children[index].id = 'selected-hex';
        getInfo(
            hexOutput.children[index].innerText +
            (hexOutput.children[index + 1]?.innerText ?? '00') +
            (hexOutput.children[index + 2]?.innerText ?? '00') +
            (hexOutput.children[index + 3]?.innerText ?? '00') +
            (hexOutput.children[index + 4]?.innerText ?? '00') +
            (hexOutput.children[index + 5]?.innerText ?? '00') +
            (hexOutput.children[index + 6]?.innerText ?? '00') +
            (hexOutput.children[index + 7]?.innerText ?? '00')
            , index, hexOutput.children.length);
    }
}

function handleKey(event) {
    event.preventDefault();
    if (event.keyCode == 37) {
        let index =  Array.prototype.indexOf.call(document.getElementById('selected-hex').parentNode.children, document.getElementById('selected-hex'));
        if (activeHex) {
            hexOutput.children[index - 1].click();
        } else {
            textOutput.children[index - 1].click();
        }
    } else if (event.keyCode == 39) {
        let index =  Array.prototype.indexOf.call(document.getElementById('selected-hex').parentNode.children, document.getElementById('selected-hex'));
        if (activeHex) {
            hexOutput.children[index + 1].click();
        } else {
            textOutput.children[index + 1].click();
        }
    } else if (event.keyCode == 38) {
        let index =  Array.prototype.indexOf.call(document.getElementById('selected-hex').parentNode.children, document.getElementById('selected-hex'));
        if (activeHex) {
            hexOutput.children[index - 16].click();
        } else {
            textOutput.children[index - 16].click();
        }
    } else if (event.keyCode == 40) {
        let index =  Array.prototype.indexOf.call(document.getElementById('selected-hex').parentNode.children, document.getElementById('selected-hex'));
        if (activeHex) {
            hexOutput.children[index + 16].click();
        } else {
            textOutput.children[index + 16].click();
        }
    }
    if (activeHex) {
        var selected = document.getElementById('selected-hex');
        if ("1234567890abcdef".includes(event.key) && !" ".includes(event.key)) {
            if (selected.getAttribute('data-type') == '1') {
                selected.innerText += event.key.toUpperCase();;
                selected.setAttribute('data-type', '0');
                let index =  Array.prototype.indexOf.call(selected.parentNode.children, selected);
                let byteVal = parseInt(selected.innerText, 16);
                let text = String.fromCharCode(byteVal);
                if ((byteVal >= 0 && byteVal) < 32 || (byteVal >= 128 && byteVal < 160)) {
                    textOutput.children[index].className = 'lf';
                    text = " ";
                } else {
                    textOutput.children[index].className = '';
                }
                textOutput.children[index].innerText = text;
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
            let index =  Array.prototype.indexOf.call(selected.parentNode.children, selected);

            let byteVal = selected.innerText.charCodeAt(0);
            let hex = byteVal.toString(16).padStart(2, '0').toUpperCase();;

            hexOutput.children[index].innerText = hex;
            selected.parentNode.children[index + 1].click();
        }
    }
    
}

function getInfo(hexData, index, length) {
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