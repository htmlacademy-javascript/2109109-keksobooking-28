const ALERT_SHOW_TIME = 5000;

const container = document.querySelector('.alert-container');

function displayAlert(message) {
  container.textContent = message;

  container.classList.remove('hidden');
  setTimeout(() => {
    container.classList.add('hidden');
  }, ALERT_SHOW_TIME);
}

function isEscapeKeyPressed(evt) {
  return evt.key === 'Escape';
}

function debounce(callback, timeoutDelay = 100) {
  let timeoutId;

  return function (...rest) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

// eslint-disable-next-line no-shadow
function setElementAvailability(selector, container = document, state = true) {
  container.querySelectorAll(selector).forEach((element) => {
    element.disabled = state;
  });
}

export { displayAlert, isEscapeKeyPressed, debounce, setElementAvailability };
