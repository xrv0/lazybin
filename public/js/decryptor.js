const contentDiv = document.getElementById("paste_content");
const id = document.location.pathname.split("/")[2];
const key = document.location.hash.substring(1);

document.title = document.title.replace("$id", id);

try {
    fetch("/fetch/" + id).then((response) => {
        if(response.status === 200) {
            return response.json();
        }else if(response.status === 404) {
            document.location.href = "/notfound";
        }else {
            document.location.href = "/error";
        }
        document.location.hash = "";
    }).then((data) => {
        contentDiv.innerText = escapeHtml(sjcl.decrypt(key, data["content"]));
        if(data["highlighting"]) {
            hljs.highlightBlock(contentDiv);
        }
    });
}catch (e) {
    contentDiv.innerText = "Decryption failed!";
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}