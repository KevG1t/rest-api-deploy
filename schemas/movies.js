const z = require('zod') // para validaciones

const movieSchena = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is requeride',
      invalid_type_error: 'Movie genre must be an array of enum genre'
    }
  )
})

function validateMovie (object) {
//   return movieSchena.parse(object)
// mas facil de validar si da error
  return movieSchena.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchena.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
