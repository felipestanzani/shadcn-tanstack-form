"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { createFormHookContexts, useStore } from "@tanstack/react-form"

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
    // don't show errors on untouched fields unless the user attempted to submit before
    const showError = isTouched || submissionAttempts > 0

    let errorMessage: string | null = null
    if (showError && errors.length > 0) {
      const error = errors[0]

      if (typeof error === "string") {
        errorMessage = error
      } else if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
          // there is a `message` string property in the object
          errorMessage = error.message
        }
      } else if (error !== null && error !== undefined) {
        // as fallback, stringify truthy errors
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

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <IdContext.Provider value={id}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </IdContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const formItem = useFormItemContext()

  return (
    <Label
      data-slot="form-label"
      data-error={formItem.hasError}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItem.formControlId}
      {...props}
    />
  )
}

function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { formControlId, formDescriptionId, formMessageId, hasError } =
    useFormItemContext()

  const describedBy = hasError
    ? `${formDescriptionId} ${formMessageId}`
    : `${formDescriptionId}`

  return (
    <Slot
      data-slot="form-control"
      id={formControlId}
      aria-describedby={describedBy}
      aria-invalid={hasError}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormItemContext()

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
  const { error, formMessageId } = useFormItemContext()
  const body = error ?? props.children

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
