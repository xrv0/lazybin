const content = document.getElementById("content");
let key = document.documentURI.split("#")[1];

if(!key) {
    key = localStorage.getItem("lastKey");
    localStorage.removeItem("lastKey");
    document.location.hash = key;
}

if(key) {
    console.log(key, content.textContent);
    decryptedContent = sjcl.decrypt(key, content.textContent);
    content.textContent = decryptedContent;
}else {
    content.textContent = "Decryption failed. Key missing";
}

