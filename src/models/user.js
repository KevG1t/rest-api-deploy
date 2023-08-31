import { con } from '../db/mysql_con.js'

export class UserModel {
  static async getAll () {
    const result = await con.query('SELECT * FROM users')
    return result[0] // Assuming the query result is an array
  }

  static async getById ({ id }) {
    const result = await con.query('SELECT * FROM users WHERE id = ?', [id])
    return result[0][0] || null
  }

  static async create ({ data }) {
    const { name, password, email } = data
    const result = await con.query('INSERT INTO users (name, password, email) VALUES (?, ?, ?)', [name, password, email])
    return result[0]
  }

  static async delete ({ id }) {
    const result = await con.query('DELETE FROM users WHERE id = ?', [id])
    return result[0].affectedRows > 0
  }

  static async update ({ id, data }) {
    const { name, password, email } = data
    const result = await con.query('UPDATE users SET name = ?, password = ?, email = ? WHERE id = ?', [name, password, email, id])
    return result[0].affectedRows > 0
  }
}
