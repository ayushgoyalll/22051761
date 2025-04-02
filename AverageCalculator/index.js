const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const WINDOW_SIZE = 10;
const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAxMTQ2LCJpYXQiOjE3NDM2MDA4NDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImNlMWUxMmQ2LTFlZWMtNDliNy05M2IzLTg4NzA0NDIxZjk1YiIsInN1YiI6ImdveWFsYXl1c2gzMDg5QGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImdveWFsYXl1c2gzMDg5QGdtYWlsLmNvbSIsIm5hbWUiOiJheXVzaCBnb3lhbCIsInJvbGxObyI6IjIyMDUxNzYxIiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiY2UxZTEyZDYtMWVlYy00OWI3LTkzYjMtODg3MDQ0MjFmOTViIiwiY2xpZW50U2VjcmV0IjoiVERtUmhoSllUa1BIRWpzeCJ9.GCRP7VEoPRLmV3ga_gZJC5XfsPAcj5IZCL-ZG_L7oAo";
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
        console.log(token);
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

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;

    if (!API_URLS[type]) {
        return res.status(400).json({ error: 'type is invalid' });
    }

    const NEW_NUM = await FETCH(type);

    if (NEW_NUM .length === 0) {
        return res.status(500).json({ error: "Failed to fetch numbers" });
    }

    const windowPrevState = [...window]; 
   
    NEW_NUM.forEach(num => {
        if (!window.includes(num)) {
            window.push(num);
        }
    });

 
    while (window.length > WINDOW_SIZE) {
        window.shift();
    }

    const avg = window.length ? (window.reduce((sum, num) => sum + num, 0) / window.length) : 0;

    res.json({
        windowPrevState,
        windowCurrState: [...window],
        numbers: NEW_NUM ,
        avg: parseFloat(avg.toFixed(2))
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
