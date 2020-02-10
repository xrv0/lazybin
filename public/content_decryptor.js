const content = document.getElementById("content");
const key = document.documentURI.split("#")[1];

console.log(key, content.textContent);
decryptedContent = sjcl.decrypt(key, content.textContent);
content.textContent = decryptedContent;