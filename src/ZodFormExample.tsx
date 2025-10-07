import { z } from "zod"
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "./components/ui/input"
import { Checkbox } from "./components/ui/checkbox"
import { Textarea } from "./components/ui/textarea"
import { useAppForm } from "@/hooks/form-hook"

// Define Zod schema
const userSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.email("Please enter a valid email address"),
  age: z
    .number()
    .min(18, "You must be at least 18 years old")
    .max(120, "Age must be realistic"),
  website: z.url("Please enter a valid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
})

type UserFormData = z.input<typeof userSchema>

export default function ZodFormExample() {
  const defaultValues: UserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    age: 18,
    website: "",
    bio: "",
    terms: false,
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value)
      alert(`Registration successful for ${value.firstName} ${value.lastName}!`)
    },
  })

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Registration Form</h1>
        <p className="text-muted-foreground">
          Complete form validation using Zod v4 with TanStack Form
        </p>
      </div>

      <form.AppForm>
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="firstName">
              {(field) => (
                <Field>
                  <FieldLabel>First Name *</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="Enter your first name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldControl>
                  <FieldError />
                </Field>
              )}
            </form.AppField>

            <form.AppField name="lastName">
              {(field) => (
                <Field>
                  <FieldLabel>Last Name *</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="Enter your last name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldControl>
                  <FieldError />
                </Field>
              )}
            </form.AppField>
          </div>

          <form.AppField name="email">
            {(field) => (
              <Field>
                <FieldLabel>Email Address *</FieldLabel>
                <FieldControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldControl>
                <FieldDescription>
                  We'll never share your email with anyone else.
                </FieldDescription>
                <FieldError />
              </Field>
            )}
          </form.AppField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="age">
              {(field) => (
                <Field>
                  <FieldLabel>Age *</FieldLabel>
                  <FieldControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                  </FieldControl>
                  <FieldDescription>
                    Must be 18 or older to register.
                  </FieldDescription>
                  <FieldError />
                </Field>
              )}
            </form.AppField>

            <form.AppField name="website">
              {(field) => (
                <Field>
                  <FieldLabel>Website (Optional)</FieldLabel>
                  <FieldControl>
                    <Input
                      type="url"
                      placeholder="https://your-website.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldControl>
                  <FieldDescription>
                    Your personal or professional website.
                  </FieldDescription>
                  <FieldError />
                </Field>
              )}
            </form.AppField>
          </div>

          <form.AppField name="bio">
            {(field) => (
              <Field>
                <FieldLabel>Bio (Optional)</FieldLabel>
                <FieldControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldControl>
                <FieldDescription>
                  Brief description about yourself (max 500 characters).
                </FieldDescription>
                <FieldError />
              </Field>
            )}
          </form.AppField>

          <form.AppField name="terms">
            {(field) => (
              <Field
                orientation="horizontal"
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FieldControl>
                  <Checkbox
                    checked={field.state.value}
                    // 'indeterminate' is coerced to false
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                </FieldControl>
                <div className="space-y-1 leading-none">
                  <FieldLabel>Accept terms and conditions *</FieldLabel>
                  <FieldDescription>
                    You agree to our Terms of Service and Privacy Policy.
                  </FieldDescription>
                  <FieldError />
                </div>
              </Field>
            )}
          </form.AppField>

          <div className="pt-6 border-t">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex-1"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      form.reset()
                    }}
                  >
                    Reset Form
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </div>

          {/* Form State Debug Info */}
          <form.Subscribe>
            {(state) => (
              <details className="mt-6 p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-medium">
                  Debug: Form State
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      values: state.values,
                      errors: state.errors,
                      canSubmit: state.canSubmit,
                      isSubmitting: state.isSubmitting,
                    },
                    null,
                    2
                  )}
                </pre>
              </details>
            )}
          </form.Subscribe>
        </Form>
      </form.AppForm>
    </div>
  )
}
