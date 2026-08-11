"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import axios from "axios";
import { apiUrl } from "../../environment";
import { ChatProvider } from "@/context/ChatContext";

export function Providers({ children }) {
  axios.defaults.baseURL = apiUrl;
  return (
    <Provider store={store}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </Provider>
  );
}
export const baseUrl = apiUrl;
// export const axiosInstance2 = axios.create({
//   baseURL: "https://developfix.decentrawood.com",
// });
// export const axiosInstance2 = axios.create({
//   baseURL: "http://192.168.1.23:5000",
// });