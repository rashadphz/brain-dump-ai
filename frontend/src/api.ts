import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000";
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) =>
    instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) =>
    instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

interface CompletionResponse {
  result: string;
}

export const Completions = {
  getCompletion: (
    text: string,
    completionSize: "word" | "sentence" | "multi-line"
  ): Promise<CompletionResponse> =>
    requests.post(`/api/completions`, { text, completionSize }),
};
