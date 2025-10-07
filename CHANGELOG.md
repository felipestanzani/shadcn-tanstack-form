# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-07

### Added

- **General Availability of the new Form component set**: The Form component suite is now stable and production-ready.
- **Component naming alignment with shadcn Field components**: Internal component names have been aligned with shadcn Field components and are exported as overrides when imported from this library:
  - `Field`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError`.
- **Hierarchy support in form-hook**: The form hook now registers the new Form components in its hierarchy, enabling two usage modes in the same file:
  - Regular usage with the Form components.
  - Optional hierarchical usage where the render-prop `field` exposes `field.Field`, `field.Label`, `field.Control`, `field.Description`, `field.Error` alongside shadcn Field components.
- **Tests for hierarchical usage**: Added `test/components/ui/form_hierarchy.test.tsx` to validate behavior, ARIA attributes, and error handling when using the field hierarchy.

### Changed

- **Form component overrides**: Importing components from `@/components/ui/form` now provides components that override shadcn Field components with improved accessibility and error state handling.

### Breaking Changes

- **Renamed internal components** to match shadcn Field naming. Replace previous names with the following:
  - `FormItem` → `Field`
  - `FormLabel` → `FieldLabel`
  - `FormControl` → `FieldControl`
  - `FormDescription` → `FieldDescription`
  - `FormMessage` → `FieldError`
- **Import paths unchanged** for the new set; ensure you import from `@/components/ui/form` and `@/hooks/form-hook`.

### Migration Guide

1. Update JSX usages to the new component names listed above.
2. Keep importing Form components from `@/components/ui/form` and the hook from `@/hooks/form-hook`.
3. Optional: Adopt the hierarchical usage pattern where the `field` render prop provides `field.Field`, `field.Label`, `field.Control`, `field.Description`, and `field.Error` for local scoping alongside shadcn Field components.

## [0.5.0-beta] - 2024-12-19

### Added

- **New shadcn/ui Field Components**: Complete rewrite using modern shadcn/ui field components
  - `Field` component with orientation variants (vertical, horizontal, responsive)
  - `FieldLabel` component with enhanced styling and accessibility
  - `FieldDescription` component with improved typography
  - `FieldError` component with better error handling and display
  - `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle` components
- **Enhanced Accessibility**: Improved ARIA attributes and semantic HTML structure
- **Responsive Design**: Added responsive orientation support for form fields
- **Better Error Handling**: Enhanced error display with support for multiple errors and custom error content

### Changed

- **FormItem Component**: Now uses the new `Field` component instead of basic `div`
  - Added `data-invalid` attribute for better styling control
  - Improved error state management
- **FormLabel Component**: Now uses `FieldLabel` instead of basic `Label`
  - Enhanced styling with error state indicators
  - Better integration with form validation
- **FormDescription Component**: Now uses `FieldDescription` with improved typography
- **FormMessage Component**: Now uses `FieldError` with enhanced error display
- **FormControl Component**: Improved `aria-describedby` attribute handling
  - Changed from string concatenation to array filtering for better null handling
  - Better filtering of empty description IDs
  - More robust accessibility support

### Technical Improvements

- **Component Architecture**: Migrated from basic HTML elements to specialized field components
- **Styling System**: Enhanced with class-variance-authority for better variant management
- **Type Safety**: Improved TypeScript integration with better prop types
- **Performance**: Optimized re-renders with better memoization strategies

### Breaking Changes

- **Import Paths**: Form components now import from `@/components/ui/field` instead of using basic HTML elements
- **Component Props**: Component prop inheritance has changed significantly:
  - `FormItem`: Now inherits from `React.ComponentProps<typeof Field>` instead of `React.ComponentProps<"div">`
  - `FormLabel`: Now inherits from `React.ComponentProps<typeof FieldLabel>` instead of `React.ComponentProps<typeof LabelPrimitive.Root>`
  - `FormDescription`: Now inherits from `React.ComponentProps<typeof FieldDescription>` instead of `React.ComponentProps<"p">`
  - `FormMessage`: Now inherits from `React.ComponentProps<typeof FieldError>` instead of `React.ComponentProps<"p">`
- **Prop Types**: Components now inherit additional props from their respective field components (orientation variants, error handling, etc.)
- **Styling Classes**: Updated CSS classes to use the new field component styling system

### Migration Guide

To migrate from v0.0.0 to v0.5.0-beta:

1. **Install Required Dependencies**: Install the new shadcn field component:
   ```bash
   pnpm dlx shadcn@latest add field
   ```
2. **Update Imports**: Change imports from `old_form.tsx` to `form.tsx`
3. **Update Hook Imports**: Change imports from `old-form-hook.tsx` to `form-hook.tsx`
4. **Review Styling**: Check if any custom CSS needs updates due to new class names
5. **Test Accessibility**: Verify that accessibility features work as expected with the new components

## [0.0.0] - Initial Release

### Added

- Basic form components using TanStack Form
- Form validation and error handling
- Basic accessibility support
- Simple form item, label, control, description, and message components
