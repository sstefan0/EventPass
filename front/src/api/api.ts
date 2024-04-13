import axios, { AxiosInstance, AxiosResponse } from "axios";

const baseURL = "http://localhost:3000/";

const responseBody = (response: AxiosResponse) => response.data;

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const imageApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart:form-data",
    Authorization: "Bearer " + localStorage.getItem("accessToken"),
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const requests = {
  get: (url: string) => api.get(url).then(responseBody),
  post: (url: string, body: {}) => api.post(url, body).then(responseBody),
  put: (url: string, body: {}) => api.put(url, body).then(responseBody),
  delete: (url: string, body: {}) => api.post(url, body).then(responseBody),
  deleteOne: (url: string) => api.delete(url).then(responseBody),
};

const Auth = {
  login: (body: any) => requests.post("auth/login", body),
  register: (body: any) => requests.post("auth/register", body),
  forgotPassword: (body: any) => requests.post("auth/forgotPassword", body),
  resetPassword: (body: any) => requests.post("auth/resetPassword", body),
  userInfo: () => requests.get("/user"),
};

const Event = {
  cities: (countryId: string) => requests.get(`/cities?country=${countryId}`),
  getAll: () => requests.get("/event/get-all"),
  getAllCategory: (category: string) =>
    requests.get(`event/get-all?id=${category}`),
  getOne: (eventId: string) => requests.get(`event/get-by-id?id=${eventId}`),
  statistics: (eventId: string) =>
    requests.get(`event/statistics?id=${eventId}`),
  types: () => requests.get("/event/types"),
  ticketTypes: () => requests.get("/event/ticketTypes"),
  uploadImage: (image: any) =>
    imageApi.post("/event/upload", image).then(responseBody),
  create: (body: any) => requests.post("/event/create", body),
  addTickets: (body: any) => requests.post("event/add-tickets", body),
  deleteEvent: (eventId: string) =>
    requests.deleteOne(`event/delete?id=${eventId}`),
  getByOrganizer: () => requests.get("/event/organizer"),
  update: (body: any) => requests.put("/event/update", body),
  deleteTickets: (body: any) => requests.delete("event/delete-tickets", body),
};

const Purchase = {
  history: () => requests.get("/purchase/history"),
  purchase: (body: any) => requests.post("/purchase", body),
  pdf: async (purchaseId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`/purchase/pdf?id=${purchaseId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

const callApi = {
  Auth,
  Event,
  Purchase,
};

export default callApi;
