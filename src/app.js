const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const mongodb = require('./mongodb/mongodb.connect');

const app = express();
mongodb.connect();

app.use(express.json());

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.jsonp('Hello world');
});

module.exports = app;