function getRandomInteger(min, max) {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomIdFromRangeGenerator(min, max, callback) {
  const previousValues = new Set();
  return function () {
    let currentValue = callback(min, max);
    while (previousValues.has(currentValue)) {
      currentValue = callback(min, max);
    }
    previousValues.add(currentValue);
    return currentValue;
  };
}

function sortRandomly(arr) {
  const shuffledArray = [...arr];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export {
  getRandomInteger,
  getRandomArbitrary,
  createRandomIdFromRangeGenerator,
  sortRandomly,
};
