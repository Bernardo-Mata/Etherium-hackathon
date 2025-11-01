/**
 * Cifrado César simple y barato para encriptar datos de órdenes
 * ROT (Rotate) - método de cifrado por sustitución donde cada letra se desplaza
 */

/**
 * Encripta un texto usando cifrado César
 * @param {string} text - Texto a encriptar
 * @param {number} shift - Número de posiciones a rotar (default: 13)
 * @returns {string} - Texto encriptado
 */
export function caesarEncrypt(text, shift = 13) {
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
            // Rotar números también
            const num = parseInt(char);
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
 * @param {number} shift - Número de posiciones usadas (default: 13)
 * @returns {string} - Texto desencriptado
 */
export function caesarDecrypt(encrypted, shift = 13) {
    return caesarEncrypt(encrypted, -shift);
}

/**
 * Encripta un objeto JSON usando cifrado César
 * @param {object} data - Objeto a encriptar
 * @param {number} shift - Número de posiciones a rotar (default: 13)
 * @returns {string} - JSON encriptado como string
 */
export function encryptOrder(data, shift = 13) {
    const jsonString = JSON.stringify(data);
    return caesarEncrypt(jsonString, shift);
}

/**
 * Desencripta un string JSON encriptado
 * @param {string} encryptedJson - JSON encriptado como string
 * @param {number} shift - Número de posiciones usadas (default: 13)
 * @returns {object} - Objeto desencriptado
 */
export function decryptOrder(encryptedJson, shift = 13) {
    const decrypted = caesarDecrypt(encryptedJson, shift);
    return JSON.parse(decrypted);
}

// Clave de desplazamiento (puede ser configurable)
export const DEFAULT_SHIFT = 13; // ROT13 (mitad del alfabeto)

