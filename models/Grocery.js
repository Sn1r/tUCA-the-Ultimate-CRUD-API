const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

require("dotenv").config();

const connection = mongoose.createConnection(process.env.MONGO_URI);
autoIncrement.initialize(connection);

const grocerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

grocerySchema.plugin(autoIncrement.plugin, {
  model: "Grocery",
  field: "id",
  startAt: 5,
  incrementBy: 1,
});

const Grocery = mongoose.model("groceries", grocerySchema);

module.exports = Grocery;
