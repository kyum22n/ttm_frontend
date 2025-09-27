import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

function addAuthHeader(jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

function removeAuthHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

// 다른곳에서 import 하기 위해 ex) store
export default { addAuthHeader, removeAuthHeader };
