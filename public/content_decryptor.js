const content = document.getElementById("content");
const id = document.documentURI.split("/")[document.documentURI.split("/").length - 1];

let key = document.documentURI.split("#")[1];

if(!key) {
    key = localStorage.getItem(id);
    document.location.hash = key;
}

console.log(key, content.textContent);
decryptedContent = sjcl.decrypt(key, content.textContent);
content.textContent = decryptedContent;