// This test file is type safe and follows TanStack Form principles
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { z } from "zod"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppForm } from "@/hooks/form-hook"

// Test schema
const testSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18"),
})

type TestFormData = z.infer<typeof testSchema>

const TestFormComponent = ({
  onSubmit,
}: {
  onSubmit?: (data: TestFormData) => void
}) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      age: 18,
    },
    validators: {
      onChange: testSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.(value)
    },
  })

  return (
    <form.AppForm>
      <Form data-testid="test-form">
        <form.AppField name="name">
          {(field) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  data-testid="name-input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-testid="email-input"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </FormControl>
              <FormDescription>Enter your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>

        <form.AppField name="age">
          {(field) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  data-testid="age-input"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              data-testid="submit-button"
              disabled={!canSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </form.AppForm>
  )
}

describe("Form Components", () => {
  it("renders form with proper context", () => {
    render(<TestFormComponent />)
    expect(screen.getByTestId("test-form")).toBeInTheDocument()
  })

  it("provides form context to children", () => {
    render(<TestFormComponent />)
    expect(screen.getByTestId("name-input")).toBeInTheDocument()
    expect(screen.getByTestId("email-input")).toBeInTheDocument()
    expect(screen.getByTestId("age-input")).toBeInTheDocument()
  })

  it("handles field value changes", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "John")
    expect(nameInput).toHaveValue("John")
  })

  it("validates field on change", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters")
      ).toBeInTheDocument()
    })
  })

  it("renders with proper className", () => {
    render(<TestFormComponent />)
    const formItems = document.querySelectorAll('[data-slot="form-item"]')
    expect(formItems.length).toBeGreaterThan(0)
  })

  it("renders label with proper text", () => {
    render(<TestFormComponent />)
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("Age")).toBeInTheDocument()
  })

  it("applies error styling when field has error", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      const nameLabel = screen.getByText("Name")
      expect(nameLabel).toHaveAttribute("data-error", "true")
    })
  })

  it("renders control with proper attributes", () => {
    render(<TestFormComponent />)
    const nameInput = screen.getByTestId("name-input")
    expect(nameInput).toHaveAttribute("data-slot", "form-control")
  })

  it("applies aria-invalid when field has error", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      expect(nameInput).toHaveAttribute("aria-invalid", "true")
    })
  })

  it("applies proper aria-describedby", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const emailInput = screen.getByTestId("email-input")
    await user.type(emailInput, "invalid-email")
    await user.tab()

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("aria-describedby")
      const describedBy = emailInput.getAttribute("aria-describedby")
      expect(describedBy).toContain("form-item-description")
      expect(describedBy).toContain("form-item-message")
    })
  })

  it("renders description text", () => {
    render(<TestFormComponent />)
    expect(screen.getByText("Enter your email address")).toBeInTheDocument()
  })

  it("has proper id for aria-describedby", () => {
    render(<TestFormComponent />)
    const description = screen.getByText("Enter your email address")
    expect(description).toHaveAttribute("id")
    expect(description.getAttribute("id")).toContain("form-item-description")
  })

  it("renders error message when field has error", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters")
      ).toBeInTheDocument()
    })
  })

  it("does not render when no error", () => {
    render(<TestFormComponent />)
    expect(
      screen.queryByText("Name must be at least 2 characters")
    ).not.toBeInTheDocument()
  })

  it("submits form with valid data", async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TestFormComponent onSubmit={onSubmit} />)

    await user.type(screen.getByTestId("name-input"), "John Doe")
    await user.type(screen.getByTestId("email-input"), "john@example.com")
    await user.clear(screen.getByTestId("age-input"))
    await user.type(screen.getByTestId("age-input"), "25")

    await user.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      })
    })
  })

  it("prevents submission with invalid data", async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TestFormComponent onSubmit={onSubmit} />)

    await user.type(screen.getByTestId("name-input"), "J")
    await user.type(screen.getByTestId("email-input"), "invalid-email")
    await user.clear(screen.getByTestId("age-input"))
    await user.type(screen.getByTestId("age-input"), "15")

    await user.click(screen.getByTestId("submit-button"))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("validates email format", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const emailInput = screen.getByTestId("email-input")
    await user.type(emailInput, "invalid-email")
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument()
    })
  })

  it("validates age minimum", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const ageInput = screen.getByTestId("age-input")
    await user.clear(ageInput)
    await user.type(ageInput, "15")
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText("Must be at least 18")).toBeInTheDocument()
    })
  })

  it("clears errors when field becomes valid", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")

    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters")
      ).toBeInTheDocument()
    })

    await user.clear(nameInput)
    await user.type(nameInput, "John")
    await user.tab()

    await waitFor(() => {
      expect(
        screen.queryByText("Name must be at least 2 characters")
      ).not.toBeInTheDocument()
    })
  })

  it("associates labels with inputs", () => {
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    const nameLabel = screen.getByText("Name")

    expect(nameInput).toHaveAttribute("id")
    expect(nameLabel).toHaveAttribute("for")
    expect(nameInput.getAttribute("id")).toBe(nameLabel.getAttribute("for"))
  })

  it("provides proper ARIA attributes", async () => {
    const user = userEvent.setup()
    render(<TestFormComponent />)

    const nameInput = screen.getByTestId("name-input")
    await user.type(nameInput, "J")
    await user.tab()

    await waitFor(() => {
      expect(nameInput).toHaveAttribute("aria-invalid", "true")
      expect(nameInput).toHaveAttribute("aria-describedby")
    })
  })
})
