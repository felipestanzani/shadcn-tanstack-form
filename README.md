# shadcn/ui + TanStack Form

A seamless integration of [shadcn/ui](https://ui.shadcn.com/) Form components with [TanStack Form](https://tanstack.com/form), maintaining TanStack's core principles of developer experience and type safety.

## ✨ Features

- 🎯 **Type-safe forms** - Full TypeScript support with type inference
- 🚀 **TanStack Form integration** - Leverages TanStack Form's powerful state management
- 🎨 **shadcn/ui styling** - Beautiful, accessible components out of the box
- ✅ **Zod validation** - Seamless integration with Zod v4 for schema validation
- 🧪 **Comprehensive testing** - Includes test suite with testing utilities
- 📱 **Responsive design** - Mobile-friendly form layouts
- ♿ **Accessibility** - Built with accessibility best practices

## 🚀 Quick Start

### Installation

1. **Install shadcn/ui** in your project first:

   ```bash
   npx shadcn@latest init
   ```

2. **Install TanStack Form**:

   ```bash
   pnpm add @tanstack/react-form
   ```

3. **Add the Form component** to your project:

   Copy the `form.tsx` file from this repository to your `components/ui/` folder.

4. **Add the form-hook** to your project:

   Copy the `hooks/form-hook.tsx` file from this repository to your `hooks/` folder.

5. **Install additional shadcn/ui components** that you'll use with forms:
   ```bash
   npx shadcn@latest add button input label checkbox textarea
   ```

### Prerequisites

- Node.js 18+
- pnpm

## 📖 Usage

### Basic Form Example

```tsx
import { useAppForm } from "@/hooks/form-hook"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value)
      alert(`Hello ${value.firstName} ${value.lastName}!`)
    },
  })

  return (
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
        </form.AppField>

        <form.AppField name="email">
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
        </form.AppField>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </form.AppForm>
  )
}
```

### Advanced Form with Zod Validation

```tsx
import { z } from "zod"
import { useAppForm } from "@/hooks/form-hook"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Define Zod schema
const userSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
})

type UserFormData = z.infer<typeof userSchema>

export default function ZodForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      terms: false,
    } as UserFormData,
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value)
    },
  })

  return (
    <form.AppForm>
      <Form className="space-y-6">
        <form.AppField name="firstName">
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
        </form.AppField>

        <form.AppField name="terms">
          {(field) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </FormControl>
              <FormLabel>Accept terms and conditions *</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </form.AppForm>
  )
}
```

## 🏗️ Architecture

### Form Components

The integration provides the following components:

- **`Form`** - The root form component that provides TanStack Form context
- **`FormField`** - Wrapper around TanStack Form's `Field` component
- **`FormItem`** - Container for form field elements with proper spacing
- **`FormLabel`** - Accessible label component with proper associations
- **`FormControl`** - Wrapper for form inputs with error state handling
- **`FormDescription`** - Helper text component for additional field information
- **`FormMessage`** - Error message component that displays validation errors

### Key Features

1. **Type Safety**: Full TypeScript integration with type inference from form schemas
2. **Validation**: Support for both TanStack Form validators and Zod schema validation
3. **Error Handling**: Automatic error display with proper accessibility attributes
4. **State Management**: Leverages TanStack Form's reactive state management
5. **Accessibility**: Built-in ARIA attributes and proper form associations

## 🧪 Component Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage

# Type checking
pnpm run type-check
```

### Test Coverage

The project includes comprehensive tests covering:

- Form component rendering and context provision
- Field validation and error display
- User interactions and form submission
- Accessibility features
- Type safety

### Example Test

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "@tanstack/react-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

const TestForm = () => {
  const form = useForm({
    defaultValues: { name: "" },
    validators: {
      onChange: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
      }),
    },
  })

  return (
    <Form
      form={form}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FormField name="name">
        {(field) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
    </Form>
  )
}

test("validates field on change", async () => {
  const user = userEvent.setup()
  render(<TestForm />)

  const input = screen.getByRole("textbox")
  await user.type(input, "J")

  await waitFor(() => {
    expect(
      screen.getByText("Name must be at least 2 characters")
    ).toBeInTheDocument()
  })
})
```

## 📝 Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Code Quality
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript compiler

# Testing
pnpm test             # Run tests with Vitest
pnpm test -- --watch  # Run tests in watch mode
pnpm test -- --coverage # Run tests with coverage
```

## 🛠️ Dependencies

### Sample Site Dependencies

- **React 19.1.0** - Latest React version
- **@tanstack/react-form 1.14.1** - Form state management
- **zod 4.0.5** - Schema validation
- **@radix-ui** - Accessible UI primitives
- **tailwindcss 4.1.11** - Utility-first CSS framework

### Development Dependencies

- **TypeScript** - Type safety
- **Vitest** - Fast testing framework
- **Testing Library** - Testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Luca | LeCarbonator](https://github.com/LeCarbonator) - For the great contribution fixing the component.
- [TanStack Form](https://tanstack.com/form) - For the excellent form library
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component system
- [Radix UI](https://www.radix-ui.com/) - For accessible UI primitives
