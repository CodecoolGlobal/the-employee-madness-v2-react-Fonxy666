require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const Equipment = require(`./db/equipment.model`);
const favoriteBrand = require(`./db/brands.model`);
const Division = require(`./db/divisions.model`);

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

const equipmentProp = async () => {
  const employeeEquipment = await EmployeeModel.find({ equipment: { $exists: false } });
  employeeEquipment.forEach(async (element) => {
    element.equipment = `Nothing`;
    await element.save();
  });
}
equipmentProp();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); 
    next();
});

app.get('/api/divisions/:division/employees', async (req, res) => {
  const { division } = req.params;
  const employees = await EmployeeModel.find({ division: division });
  return res.json(employees);
});

app.patch("/api/divisions/:division/update", async (req, res, next) => {
  try {
    const employee = await Division.findOneAndUpdate(
      { _id: req.params.division },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ created: "desc" });
  return res.json(employees);
});

app.get("/api/divisions/", async (req, res) => {
  const divisions = await Division.find().sort({ created: "desc" });
  return res.json(divisions);
});

app.get("/api/brands/", async (req, res) => {
  const brands = await favoriteBrand.find().sort({ created: "desc" });
  return res.json(brands);
});

app.get("/api/divisions/:division", async (req, res) => {
  const employees = await Division.findById(req.params.division);
  return res.json(employees);
});

app.get("/api/brand/:id", async (req, res) => {
  const brand = await favoriteBrand.findById(req.params.id);
  return res.json(brand);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.get("/api/attendance/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;
  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.get('/api/employees/:search', (req, res) => {
  const searchParam = decodeURIComponent(req.params.search);
  console.log(searchParam);
  res.json({ message: 'Data received successfully!' });
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/attendance/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { attendance: req.body.attendance },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.get(`/api/equipments`, async (req, res) => {
  try {
    const equipments = await Equipment.find();
    return res.json(equipments);
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

app.post(`/api/equipments`, async (req, res) => {
  try{
    const { name, type, amount } = req.body;
    const newEquipment = new Equipment({
      name,
      type,
      amount
    });
    const savedEquipment = await newEquipment.save();
    res.json(savedEquipment);
  } catch (err) {
    res.status(400).json({ success: false });
  }
})

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
