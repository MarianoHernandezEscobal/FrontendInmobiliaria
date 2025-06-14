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
  // Validate the form data
  const validatedFields = formSchema.safeParse(data)

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  // In a real application, you would send this data to your email service
  // For example, using Nodemailer, SendGrid, or another email service

  // This is a simulation of an API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // For demonstration, we just log the data
  console.log("Sending contact form:", validatedFields.data)

  return { success: true }
}

