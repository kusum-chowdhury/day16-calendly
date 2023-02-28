const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require("./config/db");

require("dotenv").config();
const userRoutes = require('./routes/userRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const eventRoutes = require('./routes/eventRoutes')

connectDB();
app.set(cors());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/event', eventRoutes);


app.listen(process.env.PORT, () => {
    console.log("server is running")
})