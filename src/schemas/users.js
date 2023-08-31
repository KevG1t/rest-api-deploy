import z from 'zod'

const userSchena = z.object({
  name: z.string({
    invalid_type_error: 'user must be a string',
    required_error: 'user is required'
  }),
  password: z.string({
    invalid_type_error: 'password must be a string',
    required_error: 'password is required'
  }),
  email: z.string({
    invalid_type_error: 'email must be a string',
    required_error: 'email is required'
  }).email()
})

export function validateUser (object) {
//   return movieSchena.parse(object)
// mas facil de validar si da error
  return userSchena.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchena.partial().safeParse(object)
}
