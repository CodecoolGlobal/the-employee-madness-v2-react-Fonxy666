/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const brandNames = require("./brandNames.json");
const EmployeeModel = require("../db/employee.model");
const FavouriteBrands = require("../db/brands.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  await FavouriteBrands.deleteMany({});

  const brands = brandNames.map((name) => ({ name }));
  await FavouriteBrands.create(...brands);
  console.log('Favorite brands created');

  const fetchedBrands = await FavouriteBrands.find();
  console.log(fetchedBrands);

  const employees = names.map((name) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    attendance: false,
    favouriteBrand: pick(fetchedBrands)._id,
  }));

  await EmployeeModel.create(...employees);
  console.log('Employees created');
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});