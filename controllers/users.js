const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT * FROM users, usersAddress, usersContact WHERE usersAddress.user_id = usersContact.user_id AND users.id = usersContact.user_id ", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT ??, ??, ?? FROM ?? WHERE ?? = ?"
  const rep = ['id', 'first_name', 'last_name', 'users', 'id', req.params.id]

  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, rep)

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "INSERT INTO users(first_name, last_name) VALUES(?, ?);"
  // WHAT GOES IN THE BRACKETS

  const rep = [req.body.first_name, req.body.last_name, req.body.user_id, req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip, req.body.phone1, req.body.phone2, req.body.email];
  sql = mysql.format(sql, rep)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE ?? SET first_name = ?, last_name = ? where ?? = ?";
  const rep = ['users', req.body.first_name, req.body.last_name, 'id', req.params.id];
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, rep)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM ?? WHERE ?? = ?";
  const rep = ['users', 'id', req.params.id]
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, rep)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}