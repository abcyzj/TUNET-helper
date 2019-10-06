import browser from 'webextension-polyfill';
import CryptoJS from 'crypto-js';
import RandomString from 'random-string';

const STORAGE_USERNAME_KEY = 'username';
const STORAGE_PASSWORD_KEY = 'password';
const STORAGE_AES_KEY_KEY = 'aes_key';
const STORAGE_AES_IV_KEY = 'aes_iv';

export default class Storage {
    constructor() {
        this.AESKey = null;
        this.AESIV = null;
        this.genAESKey();
    }

    async genAESKey() {
        const cipherInfo = await browser.storage.local.get([
            STORAGE_AES_KEY_KEY,
            STORAGE_AES_IV_KEY,
        ]);
        if (cipherInfo[STORAGE_AES_KEY_KEY]) {
            this.AESKey = cipherInfo[STORAGE_AES_KEY_KEY];
        } else {
            this.AESKey = RandomString({ length: 16 });
        }
        if (cipherInfo[STORAGE_AES_IV_KEY]) {
            this.AESIV = cipherInfo[STORAGE_AES_IV_KEY];
        } else {
            this.AESIV = RandomString({ length: 16 });
        }
        await browser.storage.local.set({
            [STORAGE_AES_KEY_KEY]: this.AESKey,
            [STORAGE_AES_IV_KEY]: this.AESIV,
        });
    }

    cipher(msg) {
        const key = CryptoJS.enc.Utf8.parse(this.AESKey);
        const iv = CryptoJS.enc.Utf8.parse(this.AESIV);
        return CryptoJS.AES.encrypt(msg, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
    }

    decipher(msg) {
        if (!msg) {
            return null;
        }
        const key = CryptoJS.enc.Utf8.parse(this.AESKey);
        const iv = CryptoJS.enc.Utf8.parse(this.AESIV);
        const decrypted = CryptoJS.AES.decrypt(msg, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return CryptoJS.enc.Utf8.stringify(decrypted);
    }

    async storeCredentials(username, password) {
        await browser.storage.local.set({
            [STORAGE_USERNAME_KEY]: this.cipher(username),
            [STORAGE_PASSWORD_KEY]: this.cipher(password),
        });
    }

    async getCredentials() {
        const credentials = await browser.storage.local.get([
            STORAGE_USERNAME_KEY,
            STORAGE_PASSWORD_KEY,
        ]);
        return [
            this.decipher(credentials[STORAGE_USERNAME_KEY]),
            this.decipher(credentials[STORAGE_PASSWORD_KEY]),
        ];
    }

    async clearSettings() {
        await browser.storage.local.clear();
        await this.genAESKey();
    }
}
