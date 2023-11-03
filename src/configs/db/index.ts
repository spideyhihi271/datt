const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectURL: string = `mongodb+srv://nguyenlt2713:${process.env.DB_PASSWORD}@cluster0.xjqzt0a.mongodb.net/`
        await mongoose.connect(connectURL);
        console.log('Database connection has been complete!');
    } catch (error) {
        console.log('Failed to connection database!');
    }
};

export default connectDB;