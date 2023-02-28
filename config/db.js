const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.MONGO_URI;
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
};
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try{
        await mongoose.connect(DB_URI, MONGO_OPTIONS);
        console.log('mongo connected')
    }catch (e) {
     console.log('mongo not connected', e);
     process.exit();
    }
};
module.exports = connectDB;
  