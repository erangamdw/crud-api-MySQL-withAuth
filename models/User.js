// studentModel.js

const pool = require("../db_connection/db_connection");
const bcrypt = require("bcrypt");

class UserModel {
  async registerUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = {
        email: userData.email,
        password: hashedPassword,
      };

      const conn = await pool.getConnection();
      const [result] = await conn.query("INSERT INTO users SET ?", user);
      conn.release();

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      conn.release();
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user) {
    try {
      const { id, password, resetPasswordToken, resetPasswordExpires } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const conn = await pool.getConnection();

      const [result] = await conn.query(
        "UPDATE users SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?",
        [hashedPassword, resetPasswordToken, resetPasswordExpires, id]
      );

      conn.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
