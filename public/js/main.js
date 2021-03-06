const pasteTextarea = document.getElementById("paste_content");
const extendedSettings = document.getElementById("content_extended_settings");
const customKeyInput = document.getElementById("custom_key");

function uploadPaste() {
    const content = pasteTextarea.value;

    if(content.length > 0) {
        let key;
        if(customKeyInput.value.trim().length > 0) {
            key = customKeyInput.value;
        }else {
            key = sjcl.codec.base64.fromBits(sjcl.random.randomWords(5));
        }
        const encryptedContent = sjcl.encrypt(key, content);

        if(new Blob([encryptedContent]).size < 600 * 1000) {
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
                if(response.status == 201) {
                    document.location.href = response.headers.get("Location") + "#" + key;
                }else if(response.status >= 400) {
                    document.location.href = "/error";
                }
            });
        }else {
            console.error("Content size too large");
        }
    }
}

function toggleSettings() {
    if(extendedSettings.style.display === 'none' || extendedSettings.style.display === ''){
        extendedSettings.style.display = 'block';
    }else{
        extendedSettings.style.display = 'none';
    }
}