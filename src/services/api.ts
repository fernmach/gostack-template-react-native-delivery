import axios, { AxiosInstance, CancelTokenStatic } from 'axios';

interface ApiAxiosInstance extends AxiosInstance {
  CancelToken: CancelTokenStatic;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isCancel(value: any): boolean;
}

const api = {
  ...axios.create({
    baseURL: 'http://localhost:3333/',
  }),
  CancelToken: axios.CancelToken,
  isCancel: axios.isCancel,
} as ApiAxiosInstance;

export default api;
