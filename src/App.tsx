import { useState } from "react"
import { useForm } from "@tanstack/react-form"
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
import { Input } from "@/components/ui/input"
import ZodFormExample from "./ZodFormExample"

export default function App() {
  const [showZodForm, setShowZodForm] = useState(false)

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log("Form submitted:", value)
      alert(`Hello ${value.firstName} ${value.lastName}!`)
    },
  })

  if (showZodForm) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-10">
          <Button variant="outline" onClick={() => setShowZodForm(false)}>
            ← Back to Simple Form
          </Button>
        </div>
        <ZodFormExample />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          shadcn/ui TanStack Form components
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => setShowZodForm(true)}
          className="flex-1"
        >
          Try Zod v4 Form Example →
        </Button>
      </div>

      <Form
        form={form}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <FormField
          name="firstName"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !value
                ? "A first name is required"
                : value.length < 2
                  ? "First name must be at least 2 characters"
                  : undefined,
          }}
        >
          {(field) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                This is your public display first name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <FormField
          name="lastName"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !value
                ? "A last name is required"
                : value.length < 2
                  ? "Last name must be at least 2 characters"
                  : undefined,
          }}
        >
          {(field) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                This is your public display last name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <FormField name="email">
          {(field) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <div className="pt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex gap-2">
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    form.reset()
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </form.Subscribe>
        </div>
      </Form>
    </div>
  )
}
