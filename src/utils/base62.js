"use strict";
// src/utils/base62.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase62 = encodeBase62;
const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function encodeBase62(num) {
    let str = "";
    while (num > 0) {
        str = chars[num % 62] + str;
        num = Math.floor(num / 62);
    }
    return str || "0";
}
