import { useState } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppForm } from "./hooks/form-hook"
import ZodFormExample from "./ZodFormExample"

export default function AppH() {
  const [showZodForm, setShowZodForm] = useState(false)

  const form = useAppForm({
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

      <form.AppForm>
        <Form className="space-y-4">
          <form.AppField
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
              <field.Field>
                <field.Label>First Name</field.Label>
                <field.Control>
                  <Input
                    placeholder="Enter your first name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Description>
                  This is your public display first name.
                </field.Description>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField
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
              <field.Field>
                <field.Label>Last Name</field.Label>
                <field.Control>
                  <Input
                    placeholder="Enter your last name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Description>
                  This is your public display last name.
                </field.Description>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.Field>
                <field.Label>Email</field.Label>
                <field.Control>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.Control>
                <field.Description>
                  We'll never share your email with anyone else.
                </field.Description>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

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
      </form.AppForm>
    </div>
  )
}
