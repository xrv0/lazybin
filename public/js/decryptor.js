const contentTextarea = document.getElementById("paste_content");
const enableHighlighting = contentTextarea.textContent.split("$")[0];
const content = contentTextarea.textContent.split("$")[1];

let key = document.documentURI.split("#")[1];

if(!key) {
    key = localStorage.getItem("lastKey");
    localStorage.removeItem("lastKey");
    document.location.hash = key;
}

if(key) {
    contentTextarea.textContent = sjcl.decrypt(key, content);
}else {
    contentTextarea.textContent = "Decryption failed. Key missing";
}

if(enableHighlighting.endsWith("true")) {
    hljs.initHighlighting();
}