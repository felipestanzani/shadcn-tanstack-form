// This test file is type safe and follows TanStack Form principles
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
  useFormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const form = useForm({
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
    <Form
      form={form}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      data-testid="test-form"
    >
      <FormField name="name">
        {(field) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                data-testid="name-input"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
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
                data-testid="email-input"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>Enter your email address</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <FormField name="age">
        {(field) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                data-testid="age-input"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <Button type="submit" data-testid="submit-button">
        Submit
      </Button>
    </Form>
  )
}

const TestUseFormFieldComponent = () => {
  const { error, invalid, isDirty, isTouched, isValidating } = useFormField()

  return (
    <div>
      <div data-testid="error">{error?.message || "no-error"}</div>
      <div data-testid="invalid">{invalid ? "invalid" : "valid"}</div>
      <div data-testid="is-dirty">{isDirty ? "dirty" : "clean"}</div>
      <div data-testid="is-touched">{isTouched ? "touched" : "untouched"}</div>
      <div data-testid="is-validating">
        {isValidating ? "validating" : "not-validating"}
      </div>
    </div>
  )
}

describe("Form Components", () => {
  describe("Form", () => {
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
  })

  describe("FormField", () => {
    it("renders field with proper name", () => {
      render(<TestFormComponent />)
      const nameInput = screen.getByTestId("name-input")
      expect(nameInput).toBeInTheDocument()
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
      await user.tab() // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters")
        ).toBeInTheDocument()
      })
    })
  })

  describe("FormItem", () => {
    it("renders with proper className", () => {
      render(<TestFormComponent />)
      const formItems = document.querySelectorAll('[data-slot="form-item"]')
      expect(formItems.length).toBeGreaterThan(0)
    })

    it("provides context to children", () => {
      render(<TestFormComponent />)
      expect(screen.getByText("Name")).toBeInTheDocument()
    })
  })

  describe("FormLabel", () => {
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
  })

  describe("FormControl", () => {
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
  })

  describe("FormDescription", () => {
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
  })

  describe("FormMessage", () => {
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

    it("renders custom children when provided", () => {
      const CustomMessage = () => (
        <FormMessage>Custom error message</FormMessage>
      )

      const Wrapper = () => {
        const form = useForm({ defaultValues: {} })
        return (
          <Form form={form}>
            <FormField name="test">
              {() => (
                <FormItem>
                  <CustomMessage />
                </FormItem>
              )}
            </FormField>
          </Form>
        )
      }

      render(<Wrapper />)

      expect(screen.getByText("Custom error message")).toBeInTheDocument()
    })
  })

  describe("useFormField hook", () => {
    it("throws error when used outside FormField", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestUseFormFieldComponent />)
      }).toThrow("useFormField should be used within <FormField>")

      consoleSpy.mockRestore()
    })

    it("provides field state when used within FormField", async () => {
      const user = userEvent.setup()
      render(<TestFormComponent />)

      const nameInput = screen.getByTestId("name-input")
      await user.type(nameInput, "John")

      expect(nameInput).toHaveValue("John")
    })
  })

  describe("Form submission", () => {
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
  })

  describe("Form validation", () => {
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
  })

  describe("Accessibility", () => {
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
})
