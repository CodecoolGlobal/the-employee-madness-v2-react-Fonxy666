// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  attendance: Boolean,
  equipment: String,
  startingDate: Date,
  currentSalary: Number,
  desiredSalary: Number,
  favouriteColor: String,
  division: {
    type: Schema.Types.ObjectId,
    ref: `Division`,
  },
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
