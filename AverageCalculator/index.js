const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const WINDOW_SIZE = 10;
const token = process.env.token;
const window= [];

const API_URLS = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand'
};


const FETCH = async (type) => {
    try {
        // Function to fetch numbers from API
        const response = await axios.get(API_URLS[type], {
            timeout: 500,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.numbers;
    } catch (error) {
        console.error("Error fetching numbers:", error.message);
        return [];
    }
};

