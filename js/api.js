const API_BASE_URL = 'https://28.javascript.pages.academy/keksobooking';
const API_ROUTE = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
};

const ERROR_MESSAGE =
  'Не удалось загрузить данные. Попробуйте обновить страницу';

const request = (route, method = API_METHOD.GET, body = null) =>
  fetch(`${API_BASE_URL}${route}`, { method, body });

const getData = () =>
  request(API_ROUTE.GET_DATA).then((response) => response.json());

const sendData = (body, onSuccess, onError) =>
  request(API_ROUTE.SEND_DATA, API_METHOD.POST, body)
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch(onError);

export { getData, sendData, ERROR_MESSAGE };
