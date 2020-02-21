const pasteTextarea = document.getElementById("paste_content");
const pasteForm = document.getElementById("paste_form");
const idLength = 3;

function uploadPaste() {
    const content = pasteTextarea.value;
    const entropy = parseInt(document.getElementById("key-entropy").value);

    if(content.length > 0) {
        console.log("Generating AES Key...");
        const key = generateKey(entropy);
        const encryptedContent = sjcl.encrypt(key, content);
        const id = makeID(idLength);
        pasteTextarea.value = id + "%" + encryptedContent;
        localStorage.setItem(id, key);
        pasteForm.submit();
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

/*
Generates a pseudo random ID with given length
 */
function makeID(length) {
    let result = "";
    const characters = `abcdefghijklmnopqrstuvwxyz123456789`;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}