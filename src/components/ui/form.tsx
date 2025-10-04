"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { createFormHookContexts, useStore } from "@tanstack/react-form"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts()

function Form(props: React.ComponentProps<"form">) {
  const form = useFormContext()

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation()
        e.preventDefault()
        form.handleSubmit()
      }}
      {...props}
    />
  )
}

const IdContext = React.createContext<string>(null as never)

function useFormItemContext() {
  const field = useFieldContext()
  const idContext = React.useContext(IdContext)

  if (typeof idContext !== "string") {
    throw new Error("Form Item components should be used within <FormItem>")
  }

  const errors = useStore(field.store, (state) => state.meta.errors)
  const isTouched = useStore(field.store, (state) => state.meta.isTouched)
  const submissionAttempts = useStore(
    field.form.store,
    (state) => state.submissionAttempts
  )

  const formItem = React.useMemo(() => {
    const showError = isTouched || submissionAttempts > 0

    let errorMessage: string | null = null
    if (showError && errors.length > 0) {
      const error = errors[0]

      if (typeof error === "string") {
        errorMessage = error
      } else if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message
        }
      } else if (error !== null && error !== undefined) {
        errorMessage = String(error)
      }
    }

    return {
      formControlId: `${idContext}-form-item`,
      formDescriptionId: `${idContext}-form-item-description`,
      formMessageId: `${idContext}-form-item-message`,
      error: errorMessage,
      hasError: showError && errorMessage !== null,
    }
  }, [idContext, isTouched, submissionAttempts, errors])

  return formItem
}

function FormItem({ className, ...props }: React.ComponentProps<typeof Field>) {
  const id = React.useId()
  const field = useFieldContext()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const isTouched = useStore(field.store, (state) => state.meta.isTouched)
  const submissionAttempts = useStore(
    field.form.store,
    (state) => state.submissionAttempts
  )
  const showError = isTouched || submissionAttempts > 0
  const hasError = showError && errors.length > 0

  return (
    <IdContext.Provider value={id}>
      <Field
        data-slot="form-item"
        data-invalid={hasError ? "true" : undefined}
        className={cn("grid gap-2", className)}
        {...props}
      />
    </IdContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldLabel>) {
  const { formControlId, hasError } = useFormItemContext()

  return (
    <FieldLabel
      data-slot="form-label"
      data-error={hasError ? "true" : undefined}
      htmlFor={formControlId}
      className={className}
      {...props}
    />
  )
}

function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { formControlId, formDescriptionId, formMessageId, hasError } =
    useFormItemContext()

  const describedBy = [formDescriptionId, hasError ? formMessageId : null]
    .filter(Boolean)
    .join(" ")

  return (
    <Slot
      data-slot="form-control"
      id={formControlId}
      aria-describedby={describedBy || undefined}
      aria-invalid={hasError}
      {...props}
    />
  )
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldDescription>) {
  const { formDescriptionId } = useFormItemContext()

  return (
    <FieldDescription
      data-slot="form-description"
      id={formDescriptionId}
      className={className}
      {...props}
    />
  )
}

function FormMessage({
  className,
  ...props
}: React.ComponentProps<typeof FieldError>) {
  const { error, formMessageId } = useFormItemContext()
  const body = error ?? props.children

  if (!body) {
    return null
  }

  return (
    <FieldError
      data-slot="form-message"
      id={formMessageId}
      className={className}
      {...props}
    >
      {body}
    </FieldError>
  )
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  fieldContext,
  useFieldContext,
  formContext,
  useFormContext,
}
