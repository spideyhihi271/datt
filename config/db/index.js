const mongoose = require('mongoose');

let connect = async () => {
    const urlDatabase = `mongodb+srv://nguyenlt2713:${process.env.DB_PASSWORD}@cluster0.tad8znl.mongodb.net/`;
    try {
        await mongoose.connect(urlDatabase);
        console.log('Database connection has been complete!');
    } catch (error) {
        console.log(error);
        console.log('Failed to connection database!!!');
    }
};

module.exports = { connect };
