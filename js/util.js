const ALERT_SHOW_TIME = 5000;

const alertContainer = document.querySelector('.alert-container');

const displayAlert = (message) => {
  alertContainer.textContent = message;

  alertContainer.classList.remove('hidden');
  setTimeout(() => {
    alertContainer.classList.add('hidden');
  }, ALERT_SHOW_TIME);
};

const isEscapeKeyPressed = (evt) => evt.key === 'Escape';

const debounce = (callback, timeoutDelay = 100) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const setElementAvailability = (
  selector,
  container = document,
  state = true,
) => {
  container.querySelectorAll(selector).forEach((element) => {
    element.disabled = state;
  });
};

export { displayAlert, isEscapeKeyPressed, debounce, setElementAvailability };
