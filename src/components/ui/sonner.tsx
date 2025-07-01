"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
      toastOptions={{
        className: "!rounded-2xl",
        classNames: {
          title: '!font-semibold !text-neutral-800',
          description: '!text-neutral-700',
          success: '!text-green-500 !border-green-200 !bg-green-50',
          error: '!text-red-500 !border-red-200 !bg-red-50',
          warning: '!text-yellow-500 !border-yellow-200 !bg-yellow-50',
          info: '!text-blue-500 !border-blue-200 !bg-blue-50',
        }
      }}
    />
  )
}

export { Toaster }
