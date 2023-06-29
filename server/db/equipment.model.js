const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EquipmentSchema = new Schema({
  name: String,
  type: String,
  amount: String,
});

const Equipment = model("Equipment", EquipmentSchema, "Equipments")

module.exports = Equipment;