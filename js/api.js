import { getData } from './fetch.js';
import { activateFilters } from './activate.js';
import { showAlert } from './messages.js';

let advertisements;

try {
  advertisements = await getData();
  activateFilters();
} catch {
  showAlert('Не удалось загрузить данные. Обновите страницу.');
}

export { advertisements };
