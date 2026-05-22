import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El nombre solo puede tener letras'),

  email: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(200),

  company: z
    .string()
    .max(150, 'El nombre de la empresa es demasiado largo')
    .optional()
    .or(z.literal('')),

  service_interest: z
    .string()
    .max(200)
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(2000, 'El mensaje es demasiado largo'),
})

export type ContactFormData = z.infer<typeof contactSchema>
