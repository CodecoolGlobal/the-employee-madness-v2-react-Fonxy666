// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  attendance: Boolean,
  equipment: String,
  created: {
    type: Date,
    default: Date.now,
  },
  favouriteBrand: {
    type: Schema.Types.ObjectId,
    ref: `Brand`,
  }
});

const EmployeeModel = model("Employee", EmployeeSchema);

module.exports = EmployeeModel;
