// This code is to explain the event loop waits at poll pahse if the callback queue is empty.

const fs = require("fs");

setImmediate(() => {
  console.log("Immediate Message from eventloop_1.js");
});

fs.readFile("data.txt", "utf8", () => {
  setImmediate(() => {
    console.log("Immediate Message inside readFile from eventloop_1.js");
  });

  process.nextTick(() => {
    console.log("Next Tick Message inside readFile from eventloop_1.js");
  });

  setTimeout(() => {
    console.log("Timeout Message inside readFile from eventloop_1.js");
  }, 0);

  console.log("File Data read from eventloop_1.js");
});

setTimeout(() => {
  console.log("Timeout Message after 1 second from eventloop_1.js");
}, 0);

Promise.resolve().then(() => {
  process.nextTick(() => {
    console.log("Inner Next Tick Message from eventloop_1.js");
  });
  console.log("Promise Resolved Message from eventloop_1.js");
});

process.nextTick(() => {
  process.nextTick(() => {
    Promise.resolve().then(() => {
      console.log("Inner Promise Resolved Message from eventloop_1.js");
    });
    console.log("Inner Next Tick Message from eventloop_1.js");
  });
  console.log("Next Tick Message from eventloop_1.js");
});

console.log("Synchronous Log Message from eventloop_1.js");
