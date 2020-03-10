const pasteTextarea = document.getElementById("paste_content");
const pasteForm = document.getElementById("paste_form");
const extendedSettings = document.getElementById("content_extended_settings");

function uploadPaste() {
    const content = pasteTextarea.value;
    const entropy = parseInt(document.getElementById("key_entropy").value);

    if(content.length > 0) {
        console.log("Generating AES Key...");
        const key = generateKey(entropy);
        const encryptedContent = sjcl.encrypt(key, content);
        pasteTextarea.value = encryptedContent;
        localStorage.setItem("lastKey", key);
        pasteForm.submit();
    }
}

function toggleSettings() {
    if(extendedSettings.style.display == 'none' || extendedSettings.style.display == ''){
        extendedSettings.style.display = 'block';
    }else{
        extendedSettings.style.display = 'none';
    }
}

/*
Generates a pseudo random key for encryption
 */
function generateKey(entropy) {
    entropy = Math.ceil(entropy / 6) * 6; /* non-6-multiple produces same-length base64 */
    let key = sjcl.bitArray.clamp(sjcl.random.randomWords(Math.ceil(entropy / 32), 0), entropy);
    return sjcl.codec.base64.fromBits(key, 0).replace(/\=+$/, '').replace(/\//, '-');
}