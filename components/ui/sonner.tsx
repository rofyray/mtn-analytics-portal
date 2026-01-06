"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:bg-[hsl(var(--toast-success-bg))] group-[.toaster]:text-[hsl(var(--toast-success-text))] group-[.toaster]:border-[hsl(var(--toast-success-border))]",
          error:
            "group-[.toaster]:bg-[hsl(var(--toast-error-bg))] group-[.toaster]:text-[hsl(var(--toast-error-text))] group-[.toaster]:border-[hsl(var(--toast-error-border))]",
          warning:
            "group-[.toaster]:bg-[hsl(var(--toast-warning-bg))] group-[.toaster]:text-[hsl(var(--toast-warning-text))] group-[.toaster]:border-[hsl(var(--toast-warning-border))]",
          info:
            "group-[.toaster]:bg-[hsl(var(--toast-info-bg))] group-[.toaster]:text-[hsl(var(--toast-info-text))] group-[.toaster]:border-[hsl(var(--toast-info-border))]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
