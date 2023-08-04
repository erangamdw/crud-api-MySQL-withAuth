// studentModel.js

const pool = require("../db_connection/db_connection");

class StudentModel {
  async saveStudent(studentData) {
    try {
      const conn = await pool.getConnection();
      const [result] = await conn.query(
        "INSERT INTO students SET ?",
        studentData
      );
      conn.release();
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async updateStudent(studentId, studentData) {
    try {
      const conn = await pool.getConnection();
      const [result] = await conn.query(
        "UPDATE students SET ? WHERE student_id = ?",
        [studentData, studentId]
      );
      conn.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(studentId) {
    try {
      const conn = await pool.getConnection();
      const [result] = await conn.query(
        "DELETE FROM students WHERE student_id = ?",
        studentId
      );
      conn.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async getStudentById(studentId) {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        "SELECT * FROM students WHERE student_id = ?",
        studentId
      );
      conn.release();
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getAllStudents() {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query("SELECT * FROM students");
      conn.release();
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StudentModel();
