import { ALERT_SHOW_TIME } from './const.js';
import { isEscapeKey } from './util.js';
import { onResetAll, disableSubmitButton } from './form.js';

const successMessageTemplate = document
  .querySelector('#success')
  .content.querySelector('.success');
const errorMessageTemplate = document
  .querySelector('#error')
  .content.querySelector('.error');
const errorMessageButton = errorMessageTemplate.querySelector('.error__button');

document.body.append(successMessageTemplate);
successMessageTemplate.classList.add('hidden');
document.body.append(errorMessageTemplate);
errorMessageTemplate.classList.add('hidden');

function handleDocumentKeydownSuccess(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeSuccessMessage();
  }
}

function handleDocumentKeydownError(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeErrorMessage();
  }
}

function closeSuccessMessage() {
  successMessageTemplate.classList.add('hidden');
  document.removeEventListener('keydown', handleDocumentKeydownSuccess);
  document.removeEventListener('click', closeSuccessMessage);
  onResetAll();
}

function closeErrorMessage() {
  errorMessageTemplate.classList.add('hidden');
  document.removeEventListener('keydown', handleDocumentKeydownError);
  document.removeEventListener('click', closeErrorMessage);
}

function showSuccessMessage() {
  successMessageTemplate.classList.remove('hidden');
  document.addEventListener('keydown', handleDocumentKeydownSuccess);
  document.addEventListener('click', closeSuccessMessage);
}

function showErrorMessage() {
  errorMessageTemplate.classList.remove('hidden');
  document.addEventListener('keydown', handleDocumentKeydownError);
  document.addEventListener('click', closeErrorMessage);
  errorMessageButton.addEventListener('click', closeErrorMessage);
  disableSubmitButton(false);
}

const messageContainer = document.createElement('div');
messageContainer.style.zIndex = '100';
messageContainer.style.position = 'absolute';
messageContainer.style.left = '0';
messageContainer.style.top = '0';
messageContainer.style.right = '0';
messageContainer.style.padding = '10px 3px';
messageContainer.style.fontSize = '30px';
messageContainer.style.color = '#ffffff';
messageContainer.style.fontFamily = '"Roboto", "Arial", sans-serif';
messageContainer.style.textAlign = 'center';
messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
messageContainer.classList.add('hidden');
document.body.append(messageContainer);

function showAlert(message) {
  messageContainer.classList.remove('hidden');
  messageContainer.textContent = message;
  setTimeout(() => {
    messageContainer.remove();
  }, ALERT_SHOW_TIME);
}

export { showAlert, showSuccessMessage, showErrorMessage };
