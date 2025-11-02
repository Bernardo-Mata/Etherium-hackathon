/**
 * @fileoverview Utilidades de cifrado César para encriptación de datos de órdenes
 * @module utils/caesarCipher
 * 
 * Implementa cifrado César (ROT) - método de cifrado por sustitución donde
 * cada letra se desplaza un número fijo de posiciones en el alfabeto.
 * 
 * NOTA: Este cifrado es educativo y no debe usarse para datos sensibles en producción.
 * Para producción, usar algoritmos como AES-256.
 */

import { DEFAULT_CAESAR_SHIFT } from '../constants/app.constants';

/**
 * Encripta un texto usando cifrado César
 * @param {string} text - Texto a encriptar
 * @param {number} [shift=13] - Número de posiciones a rotar
 * @returns {string} Texto encriptado
 * @throws {TypeError} Si el texto no es un string
 * 
 * @example
 * caesarEncrypt('Hello123', 13) // 'Uryyb456'
 */
export function caesarEncrypt(text, shift = DEFAULT_CAESAR_SHIFT) {
    if (typeof text !== 'string') {
        throw new TypeError('El texto debe ser un string');
    }
    
    if (!text) return '';
    
    let encrypted = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        // Encriptar solo letras y números
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            const shifted = ((code - base + shift) % 26 + 26) % 26;
            char = String.fromCharCode(shifted + base);
        } else if (char.match(/[0-9]/)) {
            // Rotar números también
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
 * @param {number} [shift=13] - Número de posiciones usadas en la encriptación
 * @returns {string} Texto desencriptado
 * @throws {TypeError} Si el texto no es un string
 * 
 * @example
 * caesarDecrypt('Uryyb456', 13) // 'Hello123'
 */
export function caesarDecrypt(encrypted, shift = DEFAULT_CAESAR_SHIFT) {
    return caesarEncrypt(encrypted, -shift);
}

/**
 * Encripta un objeto JSON usando cifrado César
 * @param {Object} data - Objeto a encriptar
 * @param {number} [shift=13] - Número de posiciones a rotar
 * @returns {string} JSON encriptado como string
 * @throws {TypeError} Si data no es un objeto
 * @throws {Error} Si el objeto no puede ser serializado
 * 
 * @example
 * encryptOrder({ amount: 100, token: 'ETH' }, 13)
 */
export function encryptOrder(data, shift = DEFAULT_CAESAR_SHIFT) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError('Los datos deben ser un objeto');
    }
    
    try {
        const jsonString = JSON.stringify(data);
        return caesarEncrypt(jsonString, shift);
    } catch (error) {
        throw new Error(`Error al serializar el objeto: ${error.message}`);
    }
}

/**
 * Desencripta un string JSON encriptado
 * @param {string} encryptedJson - JSON encriptado como string
 * @param {number} [shift=13] - Número de posiciones usadas en la encriptación
 * @returns {Object} Objeto desencriptado
 * @throws {TypeError} Si encryptedJson no es un string
 * @throws {Error} Si el JSON desencriptado no es válido
 * 
 * @example
 * decryptOrder(encryptedString, 13) // { amount: 100, token: 'ETH' }
 */
export function decryptOrder(encryptedJson, shift = DEFAULT_CAESAR_SHIFT) {
    if (typeof encryptedJson !== 'string') {
        throw new TypeError('El JSON encriptado debe ser un string');
    }
    
    try {
        const decrypted = caesarDecrypt(encryptedJson, shift);
        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error(`Error al desencriptar o parsear JSON: ${error.message}`);
    }
}

/**
 * Exportar la constante de shift por defecto
 * @constant {number}
 */
export const DEFAULT_SHIFT = DEFAULT_CAESAR_SHIFT;

