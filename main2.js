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
document.getElementById('file').addEventListener("change", handleFileChange, false);
document.getElementById('save').addEventListener("click", saveFile, false);
document.getElementById('open').addEventListener("click", () => { document.getElementById('file').click(); }, false);

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function handleFileDrop(event) {
  event.preventDefault();
  loadFileToHex(event.dataTransfer.files[0]);
}

function handleFileChange(event) {
  loadFileToHex(event.target.files[0]);
}

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
  }
  else {
    event.target.parentNode.style.background = '#0ff3';
    let index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.children, event.target.parentNode);
    hexOutput.children[index].style.background = '#0ff3';
  }
}

function handleLeave(event) {
  if (event.target.parentNode.parentNode.id == "hex") {
    event.target.style.background = '';
    let index = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
    textOutput.children[index].style.background = '';
  }
  else {
    event.target.parentNode.style.background = '';
    let index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.children, event.target.parentNode);
    hexOutput.children[index].style.background = '';
  }
}

function handleClick(event) {
  if (event.target.parentNode.parentNode.id == "hex") {
    event.target.parentNode.parentNode.children[activeHex ? 0 : 1].style.background = '';
    event.target.parentNode.style.background = '#0ff3';
    activeHex = true;
    let index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.children, event.target.parentNode);
    textOutput.children[index].parentNode.children[1].style.background = '#0ff3';
    textOutput.children[index].parentNode.children[0].style.background = '';
  }
  else {
    event.target.parentNode.parentNode.children[activeHex ? 0 : 1].style.background = '';
    event.target.parentNode.parentNode.children[activeHex ? 1 : 0].style.background = '#0ff3';
    activeHex = false;
    let index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.parentNode.children, event.target.parentNode.parentNode);
    hexOutput.children[index].style.background = '#0ff3';
    textOutput.children[index].style.background = '';
  }
}

function handleKey(event) {
  const selectedElement = document.getElementById('selected-' + (activeHex ? 'hex' : 'text'));
  if (selectedElement) {
    let index = Array.prototype.indexOf.call(selectedElement.parentNode.children, selectedElement);
    if (activeHex) {
      hexOutput.children[index].style.background = '';
      textOutput.children[index].parentNode.children[1].style.background = '';
      if (event.key == "ArrowUp" && index >= 16) {
        index -= 16;
      } else if (event.key == "ArrowDown" && index < hexOutput.children.length - 16) {
        index += 16;
      } else if (event.key == "ArrowLeft" && index > 0) {
        index--;
      } else if (event.key == "ArrowRight" && index < hexOutput.children.length - 1) {
        index++;
      }
      hexOutput.children[index].style.background = '#0ff3';
      textOutput.children[index].parentNode.children[1].style.background = '#0ff3';
    } else {
      hexOutput.children[index].style.background = '';
      textOutput.children[index].style.background = '';
      if (event.key == "ArrowUp" && index > 0) {
        index--;
      } else if (event.key == "ArrowDown" && index < textOutput.children.length - 1) {
        index++;
      } else if (event.key == "ArrowLeft" && index >= 2) {
        index -= 2;
      } else if (event.key == "ArrowRight" && index < textOutput.children.length - 2) {
        index += 2;
      }
      hexOutput.children[index].style.background = '#0ff3';
      textOutput.children[index].style.background = '#0ff3';
    }
    selectedElement.id = '';
    selectedElement.style.background = '';
    selectedElement.parentNode.children[index].id = 'selected-' + (activeHex ? 'hex' : 'text');
  }
}
