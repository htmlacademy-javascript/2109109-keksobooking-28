const API_BASE_URL = 'https://28.javascript.pages.academy/keksobooking';
const API_ROUTE = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
};

async function makeRequest(route, method = HTTP_METHOD.GET, body = null) {
  const response = await fetch(`${API_BASE_URL}${route}`, { method, body });
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}

async function getData() {
  try {
    const data = await makeRequest(API_ROUTE.GET_DATA);
    return data;
  } catch {
    throw new Error('Failed to retrieve data');
  }
}

async function sendData(body) {
  try {
    await makeRequest(API_ROUTE.SEND_DATA, HTTP_METHOD.POST, body);
  } catch {
    throw new Error('Failed to send data');
  }
}

export { getData, sendData };
