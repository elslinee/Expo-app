import axios from "axios";
const aladhan_api_url = "https://api.aladhan.com/v1";

const aladhanClient = axios.create({
  baseURL: aladhan_api_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export { aladhanClient };
