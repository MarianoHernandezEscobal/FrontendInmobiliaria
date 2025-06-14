"use server"

import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

type ContactFormValues = z.infer<typeof formSchema>

export async function sendContactForm(data: ContactFormValues) {
  const validatedFields = formSchema.safeParse(data)

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { success: true }
}
