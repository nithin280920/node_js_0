let arr = ["a", "a", "b", "c", "b", "d"];
let arr1 = [1, 2, 3, 4, 5, 6];

let obj = arr.reduce((acc, curr) => {
  acc[curr] = (acc[curr] || 0) + 1;
  return acc;
}, {});

console.log(obj);

let sum = arr1.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0 ) + 1
  return acc;
}, {});

console.log(sum);

