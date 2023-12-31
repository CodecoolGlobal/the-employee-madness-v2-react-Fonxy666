/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const brandNames = require("./brandNames.json");
const divisionsFile = require("./divisionCountry.json");
const EmployeeModel = require("../db/employee.model");
const FavouriteBrands = require("../db/brands.model");
const DivisionModel = require("../db/divisions.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  await FavouriteBrands.deleteMany({});
  await DivisionModel.deleteMany({});

  const brands = brandNames.map((name) => ({ name }));
  await FavouriteBrands.create(...brands);

  //creating random divisons to the employees
  const divisions = divisionsFile.map(element => ({
    name: element.country,
    budget: Math.floor(Math.random() * (25000000 - 20000000) + 20000000),
    location: {
      country: element.country,
      city: element.city
      }
    })
  );
  await DivisionModel.create(...divisions);

  const fetchedBrands = await FavouriteBrands.find();
  const fetchedDivisions = await DivisionModel.find();

  //creating random salary to the employees 
  const randomSalary = (employee) => {
    console.log(employee);
    if (employee.level === `Junior`) {
      console.log(`junior`);
      return employee.currentSalary = Math.floor(Math.random() * (20000 - 10000) + 10000);
    } else if (employee.level === `Medior`) {
      console.log(`Medior`);
      return employee.currentSalary = Math.floor(Math.random() * (60000 - 40000) + 40000);
    } else if (employee.level === `Senior`) {
      console.log(`Senior`);
      return employee.currentSalary = Math.floor(Math.random() * (100000 - 80000) + 80000);
    } else if (employee.level === `Expert`) {
      console.log(`Expert`);
      return employee.currentSalary = Math.floor(Math.random() * (150000 - 130000) + 130000);
    } else if (employee.level === `Godlike`) {
      console.log(`Godlike`);
      return employee.currentSalary = Math.floor(Math.random() * (250000 - 200000) + 200000);
    }
  }

  //generating random desired salary to employees
  const desiredSalary = (employee) => {
    return employee.desiredSalary = employee.currentSalary + Math.floor(Math.random() * (20000 - 10000) + 10000);
  }

  //generating random starting date
  const randomStartingDate = (employee) => {
    const start = new Date(2011, 0, 1);
    const end = new Date();

    const randomTime = (start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const randomDate = new Date(randomTime);

    return employee.startingDate = randomDate;
  }

  //generating random facourite color to the employee
  function generateRandomColor(employee) {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return employee.favouriteColor = color;
  }

  //generating the employees randomly
  const employees = names.map((name) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    attendance: false,
    favouriteBrand: pick(fetchedBrands)._id,
    startingDate: Date,
    currentSalary: Number,
    desiredSalary: Number,
    favouriteColor: String,
    division: pick(fetchedDivisions)._id
  }));

  employees.forEach(employee => {
    randomSalary(employee);
    desiredSalary(employee);
    randomStartingDate(employee);
    generateRandomColor(employee);
  })

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