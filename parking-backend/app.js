const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const app = express();
require('express-async-errors')
const eventsRouter = require('./controllers/events');
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI;
mongoose.set('strictQuery',false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors())

app.use(express.json());

app.get('/', async (request, response,next) => {

    response.send('Welcome to Parking Backend')
})
app.use("/api/events", eventsRouter);

module.exports = app;