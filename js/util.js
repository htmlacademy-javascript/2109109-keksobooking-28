function getRandomInteger(a, b) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomIdFromRangeGenerator(a, b, cb) {
  const previousValues = [];
  return function () {
    let currentValue = cb(a, b);
    while (previousValues.includes(currentValue)) {
      currentValue = cb(a, b);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
}

function sortRandomly(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

export {
  getRandomInteger,
  getRandomArbitrary,
  createRandomIdFromRangeGenerator,
  sortRandomly,
};
