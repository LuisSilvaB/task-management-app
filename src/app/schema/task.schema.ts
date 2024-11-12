import { z } from 'zod'
const TaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, {
    message: "The title must be at least 3 characters",
  }),
  description: z.string().min(3, {
    message: "The description must be at least 3 characters",
  }),
  state: z.boolean(),
  created_at: z.string().optional(), 
})

export const TaskResolver = TaskSchema