import { fieldContext, formContext } from "@/components/ui/form"
import { createFormHook } from "@tanstack/react-form"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})
