/*
Generates a pseudo random ID with given length
 */
const idCharacters = `abcdefghijklmnopqrstuvwxyz123456789`;
function generateID(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += idCharacters.charAt(Math.floor(Math.random() * idCharacters.length));
    }
    return result;
}

exports.generateID = generateID;