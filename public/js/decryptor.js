const contentDiv = document.getElementById("content");
const enableHighlighting = contentDiv.textContent.split("$")[0];
const content = contentDiv.textContent.split("$")[1];

let key = document.documentURI.split("#")[1];

if(!key) {
    key = localStorage.getItem("lastKey");
    localStorage.removeItem("lastKey");
    document.location.hash = key;
}

if(key) {
    contentDiv.textContent = "Decrypting...";
    contentDiv.innerText = sjcl.decrypt(key, content);
}else {
    contentDiv.textContent = "Decryption failed. Key missing";
}

if(enableHighlighting.endsWith("true")) {
    hljs.highlightBlock(document.getElementById("content"));
}
