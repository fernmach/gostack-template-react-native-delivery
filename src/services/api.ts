import axios, { AxiosInstance, CancelTokenStatic } from 'axios';

interface ApiAxiosInstance extends AxiosInstance {
  CancelToken: CancelTokenStatic;
  isCancel(value: any): boolean;
}

const api = {
  ...axios.create({
    baseURL: 'http://localhost:3333/',
  }),
  CancelToken: axios.CancelToken,
  isCancel: axios.isCancel,
} as ApiAxiosInstance;

// api.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request, null, 2));
//   return request;
// });

// api.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response, null, 2));
//   return response;
// });

export default api;
