/**
 * @fileoverview Cifrado César para backend (Node.js)
 * @module utils/caesarCipher
 * 
 * Implementa cifrado César (ROT) para encriptación de órdenes
 * NOTA: Este es un cifrado educativo. Para producción usar AES-256.
 */

/**
 * Encripta un texto usando cifrado César
 * @param {string} text - Texto a encriptar
 * @param {number} [shift=13] - Número de posiciones a rotar
 * @returns {string} Texto encriptado
 */
function caesarEncrypt(text, shift = 13) {
    if (!text) return '';
    
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        // Solo encriptar letras y números
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            const shifted = ((code - base + shift) % 26 + 26) % 26;
            char = String.fromCharCode(shifted + base);
        } else if (char.match(/[0-9]/)) {
            const num = parseInt(char, 10);
            const shifted = ((num + shift) % 10 + 10) % 10;
            char = shifted.toString();
        }
        
        encrypted += char;
    }
    return encrypted;
}

/**
 * Desencripta un texto usando cifrado César
 * @param {string} encrypted - Texto encriptado
 * @param {number} [shift=13] - Número de posiciones usadas
 * @returns {string} Texto desencriptado
 */
function caesarDecrypt(encrypted, shift = 13) {
    return caesarEncrypt(encrypted, -shift);
}

/**
 * Encripta un objeto JSON usando cifrado César
 * @param {Object} data - Objeto a encriptar
 * @param {number} [shift=13] - Número de posiciones a rotar
 * @returns {string} JSON encriptado como string
 */
function encryptOrder(data, shift = 13) {
    const jsonString = JSON.stringify(data);
    return caesarEncrypt(jsonString, shift);
}

/**
 * Desencripta un string JSON encriptado
 * @param {string} encryptedJson - JSON encriptado como string
 * @param {number} [shift=13] - Número de posiciones usadas
 * @returns {Object} Objeto desencriptado
 * @throws {Error} Si el JSON no es válido
 */
function decryptOrder(encryptedJson, shift = 13) {
    const decrypted = caesarDecrypt(encryptedJson, shift);
    try {
        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error(`Error al parsear JSON desencriptado: ${error.message}`);
    }
}

module.exports = {
    caesarEncrypt,
    caesarDecrypt,
    encryptOrder,
    decryptOrder,
    DEFAULT_SHIFT: 13
};
