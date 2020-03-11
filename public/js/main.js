const pasteTextarea = document.getElementById("paste_content");
const extendedSettings = document.getElementById("content_extended_settings");

function uploadPaste() {
    const content = pasteTextarea.value;
    const entropy = document.getElementById("key_entropy").value;

    if(content.length > 0) {
        const key = generateKey(entropy);
        const encryptedContent = sjcl.encrypt(key, content);

        fetch("/paste_publish", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                content: encryptedContent,
                expiration_time: document.getElementById("expiration_time").value,
                highlighting: document.getElementById("enable_highlighting").checked
            })
        }).then((response) => {
            console.log(response);
            if(response.status == 201) {
                document.location.href = response.headers.get("Location") + "#" + key;
            }else if(response.status >= 400) {
                document.location.href = "/error";
            }
        });
    }
}

function toggleSettings() {
    if(extendedSettings.style.display === 'none' || extendedSettings.style.display === ''){
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