import axios from "axios";

function joinURL(baseURL, url) {
    return `${baseURL}/${url}`;
}

class Service {
  constructor() {
    this.domain = "";
    if (import.meta.env.VITE_BZENV === "development") {
      this.domain = import.meta.env.VITE_DEV_PROXY;
    }
  }

  async request(url, method = "POST", data) {
    url = joinURL(this.domain, "api/" + url);

    const res = await axios.request({
      url,
      method,
      data,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }

  post(url, data) {
    const method = "POST";
    return this.request(url, method, data);
  }

  get(url) {
    const method = "GET";
    return this.request(url, method);
  }

  delete(url, data) {
    const method = "DELETE";
    return this.request(url, method, data);
  }

  put(url, data) {
    const method = "PUT";
    return this.request(url, method, data);
  }

  patch(url, data) {
    const method = "PATCH";
    return this.request(url, method, data);
  }


  getBaseURL = () => {
    if (import.meta.env.VITE_BZENV === "development") {
      return import.meta.env.VITE_DEV_PROXY || "http://localhost:3000"; // fallback proxy
    }
    return window.location.origin;
  };
}

export default Service
