import { z } from 'zod'

export const requestUpdateSchema = z.object({
  status: z.enum(['nueva', 'en_revision', 'respondida', 'cerrada']).optional(),
  is_read: z.boolean().optional(),
  admin_note: z.string().max(2000).optional(),
})
