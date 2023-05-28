const ALERT_SHOW_TIME = 5000;
const DEFAULT_RADIX = 10;

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const getRandomUniqueNumbers = (count, maxNum = count) => {
  const uniqueNumbers = new Set();

  while (uniqueNumbers.size < count) {
    const randomNum = getRandomInteger(0, maxNum);
    uniqueNumbers.add(randomNum);
  }

  return Array.from(uniqueNumbers);
};

const createList = (source) => {
  const listLength = getRandomInteger(
    1,
    Math.min(source.length, Number.MAX_SAFE_INTEGER),
  );
  const itemsNums = getRandomUniqueNumbers(listLength, source.length - 1);

  return itemsNums.map((num) => source[num]);
};

const getRandomFloatList = (min, max, decimals, count) => {
  const floatList = [];

  for (let i = 0; i < count; i++) {
    const randomFloat = getRandomFloat(min, max, decimals);
    floatList.push(randomFloat);
  }

  return floatList;
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style = `
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    padding: 10px 3px;
    font-size: 20px;
    text-align: center;
    background-color: red;
  `;
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const debounce = (callback, timeoutDelay = 100) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), timeoutDelay);
  };
};

const throttle = (callback, delayBetweenFrames) => {
  let lastTime = 0;

  return (...args) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, args);
      lastTime = now;
    }
  };
};

export {
  getRandomInteger,
  getRandomUniqueNumbers,
  getRandomFloat,
  getRandomFloatList,
  createList,
  showAlert,
  isEscapeKey,
  debounce,
  throttle,
  DEFAULT_RADIX,
};
