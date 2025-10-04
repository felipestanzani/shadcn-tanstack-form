# Release Notes - v0.5.0-beta

**Release Date:** December 19, 2024  
**Version:** 0.5.0-beta  
**Branch:** v0.0.5-beta

## 🎉 What's New

This beta release represents a **major architectural overhaul** of the shadcn/ui + TanStack Form integration, introducing modern field components and significantly enhanced developer experience.

## ✨ Key Features

### 🏗️ Modern Field Component Architecture

- **Complete rewrite** using shadcn/ui's latest field component system
- **Enhanced accessibility** with improved ARIA attributes and semantic HTML structure
- **Responsive design** with orientation variants (vertical, horizontal, responsive)
- **Better error handling** with support for multiple errors and custom error content

### 🎨 New Field Components

- `Field` - Main field container with orientation variants
- `FieldLabel` - Enhanced label component with error state indicators
- `FieldDescription` - Improved typography and styling
- `FieldError` - Advanced error display with multiple error support
- `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle` - Complete field composition system

### 🔧 Enhanced Form Components

- **FormItem** - Now uses `Field` component with `data-invalid` attribute
- **FormLabel** - Enhanced with error state indicators and better validation integration
- **FormDescription** - Improved typography using `FieldDescription`
- **FormMessage** - Advanced error display using `FieldError`
- **FormControl** - Better `aria-describedby` attribute handling with array filtering

## 🚀 Technical Improvements

### Performance & Architecture

- **Component Architecture**: Migrated from basic HTML elements to specialized field components
- **Styling System**: Enhanced with class-variance-authority for better variant management
- **Type Safety**: Improved TypeScript integration with better prop types
- **Performance**: Optimized re-renders with better memoization strategies

### Developer Experience

- **Better Error Messages**: More descriptive and user-friendly validation messages
- **Enhanced Testing**: Comprehensive test suite with 20+ test cases
- **Improved Documentation**: Updated examples and migration guides
- **Zod v4 Support**: Full compatibility with the latest Zod validation library

## 🧪 Testing & Quality

### Comprehensive Test Coverage

- **20+ test cases** covering all major functionality
- **Accessibility testing** with proper ARIA attribute validation
- **Form validation testing** with Zod schema integration
- **User interaction testing** with form submission and error handling
- **Edge case testing** for proper error boundaries

### Test Features

- Form component rendering and context provision
- Field validation and error display
- User interactions and form submission
- Accessibility features and ARIA attributes
- Type safety validation
- Error state management

## 📦 Dependencies

### Core Dependencies

- **React 19.1.0** - Latest React version
- **@tanstack/react-form 1.14.1** - Form state management
- **Zod 4.0.5** - Schema validation
- **@radix-ui** - Accessible UI primitives
- **Tailwind CSS 4.1.11** - Utility-first CSS framework

### New Dependencies

- **class-variance-authority 0.7.1** - Enhanced variant management
- **@radix-ui/react-separator 1.1.7** - Field separator component

## 🔄 Breaking Changes

### Import Paths

- Form components now import from `@/components/ui/field` instead of using basic HTML elements

### Component Props

- **FormItem**: Now inherits from `React.ComponentProps<typeof Field>` instead of `React.ComponentProps<"div">`
- **FormLabel**: Now inherits from `React.ComponentProps<typeof FieldLabel>` instead of `React.ComponentProps<typeof LabelPrimitive.Root>`
- **FormDescription**: Now inherits from `React.ComponentProps<typeof FieldDescription>` instead of `React.ComponentProps<"p">`
- **FormMessage**: Now inherits from `React.ComponentProps<typeof FieldError>` instead of `React.ComponentProps<"p">`

### Styling Classes

- Updated CSS classes to use the new field component styling system
- New orientation variants available for responsive layouts

## 📋 Migration Guide

### Step 1: Install Required Dependencies

```bash
pnpm dlx shadcn@latest add field
```

### Step 2: Update Imports

```tsx
// Old imports
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/old_form"

// New imports
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
```

### Step 3: Update Hook Imports

```tsx
// Old import
import { useAppForm } from "@/hooks/old-form-hook"

// New import
import { useAppForm } from "@/hooks/form-hook"
```

### Step 4: Review Styling

- Check if any custom CSS needs updates due to new class names
- Test responsive layouts with new orientation variants

### Step 5: Test Accessibility

- Verify that accessibility features work as expected with the new components
- Test with screen readers and keyboard navigation

## 🎯 Example Usage

### Basic Form with New Components

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
import { Input } from "@/components/ui/input"

export default function MyForm() {
  const form = useAppForm({
    defaultValues: { name: "", email: "" },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value)
    },
  })

  return (
    <form.AppForm>
      <Form className="space-y-4">
        <form.AppField name="name">
          {(field) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>
      </Form>
    </form.AppForm>
  )
}
```

### Advanced Form with Orientation Variants

```tsx
<form.AppField name="terms">
  {(field) => (
    <FormItem orientation="horizontal" className="flex items-center space-x-2">
      <FormControl>
        <Checkbox
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
      </FormControl>
      <FormLabel>Accept terms and conditions</FormLabel>
      <FormMessage />
    </FormItem>
  )}
</form.AppField>
```

## 🐛 Bug Fixes

- Fixed `aria-describedby` attribute handling with better null filtering
- Improved error state management with proper touch state tracking
- Enhanced form submission handling with better error boundaries
- Fixed TypeScript type inference for form field components
- Resolved accessibility issues with proper ARIA attribute associations

## 🔮 What's Next

This beta release sets the foundation for:

- Additional field component variants
- Enhanced validation patterns
- More comprehensive documentation
- Performance optimizations
- Additional testing utilities

## 🤝 Acknowledgments

Special thanks to:

- **Luca | LeCarbonator** - For the significant contribution in rewriting the components
- **TanStack Form** - For the excellent form library
- **shadcn/ui** - For the beautiful component system
- **Radix UI** - For accessible UI primitives

## 📞 Support

If you encounter any issues with this beta release:

1. Check the migration guide above
2. Review the test examples in the codebase
3. Open an issue on GitHub with detailed information
4. Ensure all dependencies are properly installed

---

**Note:** This is a beta release. While thoroughly tested, please use in development environments first and report any issues you encounter.
