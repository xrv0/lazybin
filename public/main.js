const pasteTextarea = document.getElementById("paste_content");
const pasteForm = document.getElementById("paste_form");

function ValidateTextarea() {
    const content = pasteTextarea.value;
    if(content.length > 0) {
        console.log("Generating AES Key...");
        const key = generatePassword(30);
        const encryptedContent = sjcl.encrypt(key, content);
        pasteTextarea.value = encryptedContent;
        console.log("encrypted with key: "+ key);
        pasteForm.submit();
    }
}

function generatePassword(length) {
    return "test";
    let buf = new Uint8Array(length);
    window.crypto.getRandomValues(buf);
    return btoa(String.fromCharCode.apply(null, buf));
}