const express = require("express");
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Get all employees
router.get("/", getEmployees);

// Get one employee
router.get("/:id", getEmployeeById);

// Create a new employee
router.post("/", createEmployee);

// Update an employee
router.put("/:id", updateEmployee);

// Delete an employee
router.delete("/:id", deleteEmployee);

module.exports = router;