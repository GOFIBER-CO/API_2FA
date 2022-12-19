var mongoose = require("mongoose");
mongoose.set('strictQuery', false);
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    let mongodbURL = `mongodb+srv://Phuong123:Vungga12@cluster0.ydwuerd.mongodb.net/test`;
    mongoose
      .connect(mongodbURL)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
