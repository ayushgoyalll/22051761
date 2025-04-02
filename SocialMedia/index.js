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

app.get('/users', async (req, res) => {
    const users = await getData('users');
    if (!users || !users.users) return res.status(500).json({ error: 'Failed to fetch users' });

    const userPostCounts = {};
    for (const id of Object.keys(users.users)) {
        const posts = await getData(`users/${id}/posts`);
        if (posts && posts.posts) userPostCounts[id] = posts.posts.length;
    }

    const topUsers = Object.entries(userPostCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => ({ id, name: users.users[id], posts: userPostCounts[id] }));

    res.json({ topUsers });
});

app.get('/posts', async (req, res) => {
    const { type } = req.query;
    const users = await getData('users');
    if (!users || !users.users) return res.status(500).json({ error: 'Failed to fetch users' });

    let postsList = [];
    for (const id of Object.keys(users.users)) {
        const posts = await getData(`users/${id}/posts`);
        if (posts && posts.posts) postsList = postsList.concat(posts.posts);
    }

    if (!postsList.length) return res.status(500).json({ error: 'No posts found' });

    if (type === 'popular') {
        let commentCounts = {};
        for (const post of postsList) {
            const comments = await getData(`posts/${post.id}/comments`);
            if (comments && comments.comments) commentCounts[post.id] = comments.comments.length;
        }

        const maxComments = Math.max(...Object.values(commentCounts), 0);
        const popularPosts = postsList.filter(post => commentCounts[post.id] === maxComments);
        return res.json({ popularPosts });
    }

    if (type === 'latest') return res.json({ latestPosts: postsList.slice(-5) });
    
    res.status(400).json({ error: 'Invalid type parameter' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
