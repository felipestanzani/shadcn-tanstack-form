"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  AnyFieldApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormExtendedApi,
} from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormType<TFormData, TSubmitMeta> = ReactFormExtendedApi<
  TFormData,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData> | any,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta
>

type FormContextValue<TFormData, TSubmitMeta> = {
  form: FormType<TFormData, TSubmitMeta> | null
}

const FormContext = React.createContext<FormContextValue<any, any>>({
  form: null,
})

type FormProps<TFormData, TSubmitMeta> = {
  form: FormType<TFormData, TSubmitMeta>
  children: React.ReactNode
} & React.ComponentProps<"form">

function Form<TFormData, TSubmitMeta>({
  form,
  children,
  ...props
}: FormProps<TFormData, TSubmitMeta>) {
  return (
    <FormContext.Provider value={{ form }}>
      <form {...props}>{children}</form>
    </FormContext.Provider>
  )
}

// Field context to hold field information
type FormFieldContextValue = {
  field: AnyFieldApi | null
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>({
  field: null,
  name: "",
})

function FormField<TFormData = any, TFieldName extends string = string>({
  children,
  name,
  ...fieldProps
}: {
  children: (field: AnyFieldApi) => React.ReactNode
  name: TFieldName
  [key: string]: unknown
}) {
  const { form } = React.useContext(FormContext)

  if (!form) {
    throw new Error("FormField must be used within a Form component")
  }

  return (
    <form.Field name={name} {...fieldProps}>
      {(field: AnyFieldApi) => (
        <FormFieldContext.Provider value={{ field, name }}>
          {children(field)}
        </FormFieldContext.Provider>
      )}
    </form.Field>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext.field) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext
  const field = fieldContext.field
  const errors = field.state.meta.errors
  const error =
    errors && errors.length > 0
      ? {
          message:
            typeof errors[0] === "object" &&
            errors[0] !== null &&
            "message" in errors[0]
              ? (errors[0] as { message: string }).message
              : String(errors[0]),
        }
      : null

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error,
    invalid: !field.state.meta.isValid && field.state.meta.isTouched,
    isDirty: field.state.meta.isDirty,
    isTouched: field.state.meta.isTouched,
    isValidating: field.state.meta.isValidating,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
