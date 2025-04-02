const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const BASE_URL = 'http://20.244.56.144/evaluation-service'; 
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAyODE1LCJpYXQiOjE3NDM2MDI1MTUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImNlMWUxMmQ2LTFlZWMtNDliNy05M2IzLTg4NzA0NDIxZjk1YiIsInN1YiI6ImdveWFsYXl1c2gzMDg5QGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImdveWFsYXl1c2gzMDg5QGdtYWlsLmNvbSIsIm5hbWUiOiJheXVzaCBnb3lhbCIsInJvbGxObyI6IjIyMDUxNzYxIiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiY2UxZTEyZDYtMWVlYy00OWI3LTkzYjMtODg3MDQ0MjFmOTViIiwiY2xpZW50U2VjcmV0IjoiVERtUmhoSllUa1BIRWpzeCJ9.EkXqq0lpWK84pAlPvWCDRjFRPW1jCBWhjCn4yBR0IOQ";

const getData = async (url) => {
    try {
        const response = await axios.get(`${BASE_URL}/${url}`, { 
            timeout: 500,
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return null;
    }
};

