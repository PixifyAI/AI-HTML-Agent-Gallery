"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force theme to be "dark" to avoid hydration mismatch
  return (
    <NextThemesProvider {...props} forcedTheme="dark" enableSystem={false} attribute="class">
      {children}
    </NextThemesProvider>
  )
}
