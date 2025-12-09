const fs = require("node:fs");
const https = require("node:https");
const crypto = require("node:crypto");


// crypto.pbkdf2("password", "salt", 100000000, 64, "sha512", (err, derivedKey) => {
//     console.log("Derived Key: ", derivedKey.toString("hex"));
// }); //9th

setTimeout(() => {
    console.log("This message will displayed within 0 seconds");
}, 0); //3nd

setTimeout(() => {
    console.log("This message is displayed after 5 seconds");
}, 5000); //8th

https.get("https://jsonplaceholder.typicode.com/todos/1", (res) => {
    console.log("Status Code: ", res.statusCode);
});//5th

function multiply(a, b) {
    return a * b;
}
console.log(multiply(5, 10)); //1st

setImmediate(() => {
    console.log("This message is displayed immediately after I/O events");
}); //3rd

// setInterval(() => {
//     console.log("This message is displayed every 3 seconds");
// }, 3000); //6th

fs.readFile("data.txt", "utf8", (err, data) => {
  console.log("Data: ", data);
}); //5th

console.log("End of the script"); //2th
