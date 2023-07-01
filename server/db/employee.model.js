// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  attendance: Boolean,
  created: {
    type: Date,
    default: Date.now,
  },
});

const EmployeeModel = model("Employee", EmployeeSchema);

module.exports = EmployeeModel;
