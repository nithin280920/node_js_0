//In eventloop there 4 phases:
//1. Timers Phase: This phase executes callbacks scheduled by setTimeout() and setInterval().
//2. I/O Callbacks Phase(Poll): This phase executes callbacks for completed I/O operations.
//3. Check Phase: This phase executes callbacks scheduled by setImmediate().
//4. Close Callbacks Phase: This phase executes close event callbacks, e.g., socket.on('close', ...).

// Before each phase, the event loop checks for any pending microtasks (like Promises and process.nextTick()) and executes them before moving to the next phase.

// This code is to expalin the event loop phases and their execution order.
// First here when the event loop starts, it will execute the synchronous code first.
// Then it will move to the timers phase where setTimeout callbacks are executed.
// After that, it will check for I/O callbacks and execute them.
// Finally, it will execute the setImmediate callbacks.
// The order of execution will be reflected in the console logs.

// And if there are any process.nextTick() or Promise callbacks, they will be executed
// before moving to the next phase of the event loop.

const fs = require("fs");

const a = 12;

//4th log
Promise.resolve().then(() => {
  console.log("Promise Resolved Message");``
});

//6th log
setImmediate(() => {
  console.log("Immediate Message");
});

//5th log
fs.readFile("data.txt", "utf8", (err, data) => {
  console.log("File Data: ", data);
});

//7th log
setTimeout(() => {
  console.log("Timeout Message after 3 seconds");
}, 1000);

//1st log
function fun(a) {
  console.log("Function called with argument: ", a);
}
fun(a);

//2nd log
console.log("Synchronous Log Message");

//3rd log
process.nextTick(() => {
  console.log("Next Tick Message");
});
