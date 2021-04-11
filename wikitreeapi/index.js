import express from 'express';
import cors from 'cors';
import Wiki from './wiki.js';
const app = express();

app.use(cors());

app.get('/tree/:slug', async function(req, res, next) {
    const slug = req.params.slug;
    const maxDepth = req.query.maxDepth || 1; // Default max depth
    const wiki = new Wiki();
    const final_response = [];
    let response = await wiki.parse(slug);
    final_response.push(response);
    for(var depth = 1; depth < maxDepth; depth++) {
        const slug = response.slug;
        response = await wiki.parse(slug);
        final_response.push(response);
    }
    res.send(final_response);
});

app.get('/node/:slug', async function(req, res, next) {
    const slug = req.params.slug;
    const wiki = new Wiki();
    let response = await wiki.parse(slug);
    res.send(response);
});

const server = app.listen(8081, function() {
    const address = server.address();
    const host = address.address;
    const port = address.port;
    console.log('Tree Parser listening at http://%s:%s', host, port);
});