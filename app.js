const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const cors = require('cors')

const app = express()

// deshabilitar por seguridad
app.disable('x-powered-by')
// hace que el server acepte json
app.use(express.json())
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
// todos lo recursos movies se identifican con /movies

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) { // o !result.success
    // 422 unprocesable entity
    // 400 bad request
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }
  // no seria REST pero es para prueba
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.get('/movies/:id', (req, res) => { // path-to-regex
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'movies not found' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => console.log(`server listening in http://localhost:${PORT}`))
