import api from "@/api/axios";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = (
  getToken: () => string | null,
  setToken: (token: string | null) => void,
) => {
  // Clear existing interceptors to prevent duplication on re-renders
  api.interceptors.request.clear();
  api.interceptors.response.clear();

  api.interceptors.request.use((config) => {
    const token = getToken();
    // Use token from closure/state rather than localStorage for speed/security
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Don't intercept if 401 is from the refresh endpoint itself or already retried
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/users/refreshtoken")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // withCredentials ensures the refresh cookie is sent
          const res = await api.post(
            "/users/refreshtoken",
            {},
            { withCredentials: true },
          );
          const newToken = res.data.data.accessToken;

          localStorage.setItem("accessToken", newToken); // Keep storage in sync
          setToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          setToken(null);
          localStorage.removeItem("accessToken");

          // Optional: Only redirect if we are in the browser
          if (typeof window !== "undefined") {
            window.location.href = "/login?expired=true";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
};
