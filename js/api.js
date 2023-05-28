const API_BASE_URL = 'https://28.javascript.pages.academy/keksobooking';
const API_ROUTE = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
};

const makeRequest = async (route, method = HTTP_METHOD.GET, body = null) => {
  const response = await fetch(`${API_BASE_URL}${route}`, { method, body });
  if (!response.ok) {
    throw new Error('Запрос не удалось выполнить.');
  }
  return response.json();
};

const getData = async () => {
  try {
    return await makeRequest(API_ROUTE.GET_DATA);
  } catch {
    throw new Error('Не удалось получить данные.');
  }
};

const sendData = async (body) => {
  try {
    await makeRequest(API_ROUTE.SEND_DATA, HTTP_METHOD.POST, body);
  } catch {
    throw new Error('Не удалось отправить данные.');
  }
};

export { getData, sendData };
