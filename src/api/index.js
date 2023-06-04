/* eslint-disable */
import axios from "axios"

const baseURL = true ? "https://csu-dl-api.onrender.com" : "http://localhost:8080"

const JWT = localStorage.getItem("JWT")

const api_url = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json" || "multipart/form-data" || "image/png"
    }
})

export async function loginAPI(col, username, password) {
    return api_url.post("/login", {
        col: col,
        username: username,
        password: password
    })
}

export async function ProcessID(formData){
    return axios.post(`${baseURL}/ocr`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
}

          