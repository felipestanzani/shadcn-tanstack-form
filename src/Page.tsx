"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function Page() {
  const [formData, setFormData] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    terms: false,
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = formSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {}
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof FormValues] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    // Clear any existing errors and proceed with submission
    setErrors({})
    console.log("Form submitted:", result.data)
    alert("Form submitted successfully! Check the console for details.")
  }

  const handleInputChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value })
      if (errors[field]) {
        const newErrors = { ...errors }
        delete newErrors[field]
        setErrors(newErrors)
      }
    }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, terms: checked })
    if (errors.terms) {
      const newErrors = { ...errors }
      delete newErrors.terms
      setErrors(newErrors)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-balance">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Fill in your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  aria-invalid={!!errors.firstName}
                />
                <FieldError>{errors.firstName}</FieldError>
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  aria-invalid={!!errors.lastName}
                />
                <FieldError>{errors.lastName}</FieldError>
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  aria-invalid={!!errors.email}
                />
                <FieldDescription>
                  We'll never share your email with anyone else.
                </FieldDescription>
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field
                orientation="horizontal"
                data-invalid={!!errors.terms}
                className="items-start"
              >
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={handleCheckboxChange}
                />
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="terms" className="font-normal">
                    I agree to the terms and conditions
                  </FieldLabel>
                  <FieldError>{errors.terms}</FieldError>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" className="w-full mt-6">
            Submit
          </Button>
        </form>
      </div>
    </main>
  )
}
