import {
  formContext,
  fieldContext,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/form"
import { createFormHook } from "@tanstack/react-form"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Field: Field,
    Label: FieldLabel,
    Control: FieldControl,
    Description: FieldDescription,
    Error: FieldError,
  },
  formComponents: {},
})
