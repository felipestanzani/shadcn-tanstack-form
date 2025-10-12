import { useState } from "react"
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppForm } from "./hooks/form-hook"
import ZodFormExample from "./ZodFormExample"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import {
  FieldLegend,
  FieldDescription as Description,
} from "./components/ui/field"

export default function App() {
  const [showZodForm, setShowZodForm] = useState(false)

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      radio: "",
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
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl>
                  <Input
                    placeholder="Enter your first name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldControl>
                <FieldDescription>
                  This is your public display first name.
                </FieldDescription>
                <FieldError />
              </Field>
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
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl>
                  <Input
                    placeholder="Enter your last name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldControl>
                <FieldDescription>
                  This is your public display last name.
                </FieldDescription>
                <FieldError />
              </Field>
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldControl>
                <FieldDescription>
                  We'll never share your email with anyone else.
                </FieldDescription>
                <FieldError />
              </Field>
            )}
          </form.AppField>

          <form.AppField
            name="radio"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value ? "A value name is required" : undefined,
            }}
          >
            {(field) => (
              <>
                <FieldLegend>Plan</FieldLegend>
                <Description>
                  You can upgrade or downgrade your plan at any time.
                </Description>
                <RadioGroup
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  defaultValue="monthly"
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="monthly" id="plan-monthly" />
                    <FieldLabel htmlFor="plan-monthly" className="font-normal">
                      Monthly ($9.99/month)
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="yearly" id="plan-yearly" />
                    <FieldLabel htmlFor="plan-yearly" className="font-normal">
                      Yearly ($99.99/year)
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="lifetime" id="plan-lifetime" />
                    <FieldLabel htmlFor="plan-lifetime" className="font-normal">
                      Lifetime ($299.99)
                    </FieldLabel>
                  </Field>
                  <Field>
                    <FieldError />
                  </Field>
                </RadioGroup>
              </>
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
                      console.log(form.state.values)
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
