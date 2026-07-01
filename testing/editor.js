// ======================================================
// RTF Editor Engine + RTF I/O (single file)
// ======================================================

var buffer = "";
var cursor = 0;

// Resolve HTA directory
var htaPath = location.pathname.replace(/\//g, "\\");
var htaDir  = htaPath.substring(0, htaPath.lastIndexOf("\\"));

// RTF file in same directory
var filePath = htaDir + "\\file.rtf";

// ------------------------------------------------------
// Initialization
// ------------------------------------------------------
function initEditor() {
    buffer = readRTF(filePath);
    document.body.onkeydown = handleKey;
    render();
}

// ------------------------------------------------------
// Keyboard handling
// ------------------------------------------------------
function handleKey(e) {
    var key = e.keyCode;

    if (key === 37) cursorLeft();
    else if (key === 39) cursorRight();
    else if (key === 8) { backspace(); e.preventDefault(); }
    else if (key >= 32 && key <= 126) insertChar(String.fromCharCode(key));

    render();
}

// ------------------------------------------------------
// Cursor movement
// ------------------------------------------------------
function cursorLeft() {
    if (cursor > 0) cursor--;
}

function cursorRight() {
    if (cursor < buffer.length) cursor++;
}

// ------------------------------------------------------
// Editing operations
// ------------------------------------------------------
function insertChar(ch) {
    buffer = buffer.slice(0, cursor) + ch + buffer.slice(cursor);
    cursor++;
}

function backspace() {
    if (cursor > 0) {
        buffer = buffer.slice(0, cursor - 1) + buffer.slice(cursor);
        cursor--;
    }
}

// ------------------------------------------------------
// Rendering
// ------------------------------------------------------
function render() {
    var out = buffer.slice(0, cursor) + "|" + buffer.slice(cursor);
    document.getElementById("screen").innerText = out;
}

// ------------------------------------------------------
// RTF I/O
// ------------------------------------------------------
function readRTF(path) {
    var s = new ActiveXObject("ADODB.Stream");
    s.Type = 2;
    s.Charset = "utf-8";
    s.Open();
    s.LoadFromFile(path);
    var text = s.ReadText();
    s.Close();
    return text;
}

function writeRTF(path) {
    var s = new ActiveXObject("ADODB.Stream");
    s.Type = 2;
    s.Charset = "utf-8";
    s.Open();
    s.WriteText(buffer);
    s.SaveToFile(path, 2);
    s.Close();
}
