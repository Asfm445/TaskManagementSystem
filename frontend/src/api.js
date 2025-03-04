// import axios from "axios";
// export function handleForm(apiUrl, method = "GET", ob = {}) {
//   const response = fetch("http://127.0.0.1:8000/" + apiUrl, {
//     method: method,
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(ob),
//   });
//   return response;
// }
// export async function handleApiGet(apiUrl) {
//   const token = localStorage.getItem("access_token");
//   console.log(token);
//   const response = fetch("http://127.0.0.1:8000/" + apiUrl, {
//     headers: {
//       Autorization: `Bearer ${token}`,
//     },
//   });
//   return await response;
// }
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
