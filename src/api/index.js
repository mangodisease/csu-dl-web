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

export async function ProcessImage(formData){
    return axios.post(`${baseURL}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
}

export async function Process(file){
    const data = {
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        providers: 'microsoft',
        file_url: file,
        language: 'en'
    }
    return axios.post(`https://api.edenai.run/v2/ocr/ocr`, data, {
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzExZTA0ZTUtNTNhMi00OTdkLWJmM2MtYjcwNWM3YWExM2E5IiwidHlwZSI6ImFwaV90b2tlbiJ9.BdpQdROQIYyAC9FP7NbshCqJi4yr1dyIVIU05CFOI-o'
        }
      })
}
