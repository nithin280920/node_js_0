const crypto = require("node:crypto");
const fs = require("node:fs");

process.env.UV_THREADPOOL_SIZE = 1;

crypto.pbkdf2("password", "salt", 500000, 64, "sha512", (err, derivedKey) => {
    console.log("1");
});
crypto.pbkdf2("password", "salt", 500000, 64, "sha512", (err, derivedKey) => {
    console.log("2");
});
fs.readFile("data.tx", "utf8", (err, data) => {
    console.log("File Read Complete");
});
crypto.pbkdf2("password", "salt", 500000, 64, "sha512", (err, derivedKey) => {
    console.log("3");
});
crypto.pbkdf2("password", "salt", 500000, 64, "sha512", (err, derivedKey) => {
    console.log("4");
});
crypto.pbkdf2("password", "salt", 500000, 64, "sha512", (err, derivedKey) => {
    console.log("5");
}); 