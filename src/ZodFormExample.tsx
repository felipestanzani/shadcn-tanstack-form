import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "./components/ui/input"
import { Checkbox } from "./components/ui/checkbox"
import { Textarea } from "./components/ui/textarea"

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
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
})

type UserFormData = z.infer<typeof userSchema>

export default function ZodFormExample() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      website: "",
      bio: "",
      terms: false,
    } as UserFormData,
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

      <Form
        form={form}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="firstName">
            {(field) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>

          <FormField name="lastName">
            {(field) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        </div>

        <FormField name="email">
          {(field) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="age">
            {(field) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Must be 18 or older to register.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          </FormField>

          <FormField name="website">
            {(field) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://your-website.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Your personal or professional website.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        </div>

        <FormField name="bio">
          {(field) => (
            <FormItem>
              <FormLabel>Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Brief description about yourself (max 500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <FormField name="terms">
          {(field) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions *</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        </FormField>

        <div className="pt-6 border-t">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex gap-3">
                <Button type="submit" disabled={!canSubmit} className="flex-1">
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
    </div>
  )
}
