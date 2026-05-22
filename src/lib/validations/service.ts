import { z } from 'zod'

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(150),

  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000),

  price_from: z
    .number()
    .int('El precio debe ser un número entero')
    .min(0, 'El precio no puede ser negativo')
    .max(100000000, 'Precio fuera de rango'),

  icon: z
    .string()
    .max(50)
    .optional()
    .default('briefcase'),

  active: z.boolean().default(true),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
