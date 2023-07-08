const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const FavouriteModel = new Schema({
  name: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

const FavModel = model("Favourite Model", FavouriteModel, "Favourite Models")

module.exports = FavModel;