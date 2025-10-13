# shadcn/ui + TanStack Form

A seamless integration of [shadcn/ui](https://ui.shadcn.com/) Form components with [TanStack Form](https://tanstack.com/form), maintaining TanStack's core principles of developer experience and type safety.

## ✨ Features

- 🎯 **Type-safe forms** - Full TypeScript support with type inference
- 🚀 **TanStack Form integration** - Leverages TanStack Form's powerful state management
- 🎨 **shadcn/ui styling** - Beautiful, accessible components out of the box
- ✅ **Schema validation** - Seamless integration with schema validation libraries such as Zod V4
- 🧪 **Comprehensive testing** - Includes test suite with testing utilities
- 📱 **Responsive design** - Mobile-friendly form layouts
- ♿ **Accessibility** - Built with accessibility best practices

## 🚀 Quick Start

### Installation

1. **Install shadcn/ui** in your project first:

   ```bash
   pnpm dlx shadcn@latest init
   ```

2. **Install TanStack Form**:

   ```bash
   pnpm add @tanstack/react-form
   ```

3. **Add the shadcn/ui components you want. **Field component is required**.**:

   ```bash
   pnpm dlx shadcn@latest add field button input label checkbox textarea
   ```

4. **Add the shadcn-tanstack-form components** to your project:

   ```bash
   pnpm dlx shadcn@latest add https://shadcn-tanstack-form.felipestanzani.com/r/shadcn-tanstack-form.json
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
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
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
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
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

        <form.AppField name="terms">
          {(field) => (
            <Field className="flex items-center space-x-2">
              <FieldControl>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </FieldControl>
              <FieldLabel>Accept terms and conditions *</FieldLabel>
              <FieldError />
            </Field>
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

### Using Field Hierarchy

The developer can optionally use the components from the field object hierarchy. This way, if needed, the "pure" shadcn components can be used without "clashing" with Form components.

```tsx
import { useAppForm } from "@/hooks/form-hook"
import { Form } from "@/components/ui/form" /* No need to import other Form components */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value)
      alert(`Hello ${value.firstName} ${value.lastName}!`)
    },
  })

  return (
    <form.AppForm>
      <Form className="space-y-4">
        <form.AppField name="firstName">
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
```

### Note for specific shadcn/ui components

There are some shadcn components such as `<RadioGroup>` where the `<FieldDescription>` is used outside of a `<Field>` component.
In this case, you can import the original shadcn `<FieldDescription>`:

```typescript
import { FieldDescription as Description } from "./components/ui/field"
```

Or, import our wrapped `<FieldDescription>` using an alias:

```typescript
import { FieldDescription as Description } from "./components/ui/field"
```

Or else, import the `<FieldDescription>` from shadcn and use ours in the **field hierarchy**:

```typescript
import { FieldDescription } from "./components/ui/field"

<form.AppForm>
  <Form className="space-y-4">
    <form.AppField name="firstName">
      {(field) => (
        <field.Field>
          <field.Description>First Name</field.Description>
        </field.Field>
      )}
```

Both cases will work flawlessly. The only "drawback" of not using our `<FieldDescription>` if you prefer, is that the rendered HTML element won't receive an id automatically.

## 🔄 Migration to 1.0.0

Follow these steps to migrate from previous versions to 1.0.0:

1. Update component names in your TSX files to align with the new shadcn Field naming:
   - `FormItem` → `Field`
   - `FormLabel` → `FieldLabel`
   - `FormControl` → `FieldControl`
   - `FormDescription` → `FieldDescription`
   - `FormMessage` → `FieldError`

2. Ensure shadcn Field is installed (if not already):

   ```bash
   pnpm dlx shadcn@latest add field
   ```

3. Install the new version of form component:

   ```bash
   pnpm dlx shadcn@latest add https://shadcn-tanstack-form.felipestanzani.com/r/shadcn-tanstack-form.json
   ```

## 🏗️ Architecture

### Form Components

The integration provides the following components:

- **`Form`** - The root form component that provides TanStack Form context
- **`Field`** - Wrapper around shadcn `Field` component
- **`FieldLabel`** - Accessible label component with proper associations
- **`FieldControl`** - Wrapper for form inputs with error state handling
- **`FieldDescription`** - Helper text component for additional field information
- **`FieldError`** - Field error component that displays validation errors

### Key Features

1. **Type Safety**: Full TypeScript integration with type inference from form schemas
2. **Validation**: Support for both TanStack Form validators and schema validation
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

## 📦 Changelog

See the release notes: [CHANGELOG](CHANGELOG.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Luca | LeCarbonator](https://github.com/LeCarbonator) - For the great contribution fixing the component.
- [TanStack Form](https://tanstack.com/form) - For the excellent form library
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component system
- [Radix UI](https://www.radix-ui.com/) - For accessible UI primitives
