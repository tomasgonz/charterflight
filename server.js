
const express = require('express');

const app = express();

const hostname = '127.0.0.1';
const port = 8090;

const path = require('path');

app.use("/dist", express.static(__dirname + '/dist'));

app.use("/public", express.static(__dirname + '/public'));

app.get('/', (_req, _res) => {
    _res.sendFile(path.join(__dirname +  '/index.html'));
});

app.listen(port, hostname, () => {
    
    console.log(`Server running at http://${hostname}:${port}/`);


});