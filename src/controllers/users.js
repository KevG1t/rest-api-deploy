import { UserModel } from '../models/user.js'
import { validateUser, validatePartialUser } from '../schemas/users.js'

export class UserController {
  static async getAll (req, res) {
    try {
      const users = await UserModel.getAll()
      // que es lo que renderiza
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getById (req, res) { // path-to-regex
    try {
      const { id } = req.params
      const user = await UserModel.getById({ id })
      if (user) return res.json(user)

      res.status(404).json({ message: 'User not found' })
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async create (req, res) {
    try {
      const result = validateUser(req.body)

      if (result.error) { // o !result.success
      // 422 unprocesable entity
      // 400 bad request
        return res.status(400).json({ message: JSON.parse(result.error.message) })
      }

      const newUser = await UserModel.create({ data: result.data })

      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params

      const result = await UserModel.delete({ id })

      if (result === false) return res.status(404).json({ message: 'User not found' })

      return res.json({ message: 'User deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async update (req, res) {
    try {
      const result = validatePartialUser(req.body)

      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params

      const updatedUser = await UserModel.update({ id, data: result.data })

      if (updatedUser === false) return res.status(404).json({ message: 'User not found' })

      return res.json({ message: 'User updated' })
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
