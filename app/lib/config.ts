import Medusa from "@medusajs/js-sdk";

// import axios, { CreateAxiosDefaults } from "axios";

export const config = {
  MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? "_medusa_jwt",
  MEDUSA_PUBLISHABLE_KEY: process.env.MEDUSA_PUBLISHABLE_KEY,
};

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (config.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = config.MEDUSA_BACKEND_URL;
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: config.MEDUSA_PUBLISHABLE_KEY,
});

// export const axiosClient = createClient({
//   baseURL: MEDUSA_BACKEND_URL,
// });

// function createClient(options: CreateAxiosDefaults) {
//   const client = axios.create(options);

//   client.interceptors.request.use((config) => {
//     config.headers["x-publishable-api-key"] = `${config.MEDUSA_PUBLISHABLE_KEY}`;
//     config.validateStatus = (status) => status <= 500;
//     return config;
//   });

//   return client;
// }
