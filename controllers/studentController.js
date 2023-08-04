const StudentModel = require("../models/Student");

const addStudent = async (req, res) => {
  try {
    const { name, address, age, gender } = req.body;
    const studentData = { name, address, age, gender };
    const insertedStudentId = await StudentModel.saveStudent(studentData);
    res.status(201).json({
      id: insertedStudentId,
      ...studentData,
      message: "student has been created succesfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, age, gender } = req.body;
    const updatedStudent = await StudentModel.updateStudent(id, {
      name,
      address,
      age,
      gender,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      updatedStudent,
      message: "Student record updated!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await StudentModel.deleteStudent(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json("Student deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAllStudents();
    res.json({ studentsData: students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getAllStudents,
};
