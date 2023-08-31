import express, { json } from 'express'
import { usersRouter } from './routes/users.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

// deshabilitar por seguridad
app.disable('x-powered-by')
// hace que el server acepte json
app.use(json())
// cors
app.use(corsMiddleware(/* origins */))

// todos lo recursos movies se identifican con /users

app.use('/users', usersRouter)

app.use((req, res, next) => {
  res.status(404).json({ message: 'endpoint not found' })
})

export default app
