const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const divisionsModel = new Schema({
  name: String,
  boss: {
    type: Schema.Types.ObjectId,
    ref: `employee`,
  },
  budget: Number,
  location: {
    country: String,
    city: String,
  }
});

const DivisionModel = model("Divisions", divisionsModel, "Divisions")

module.exports = DivisionModel;