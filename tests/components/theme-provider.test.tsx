"use client"

import type React from "react"
import { render, screen, act, renderHook } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider, useTheme } from "@/components/theme-provider"

// Mock component to test the provider
const TestComponent = () => {
  const { theme, setTheme, toggleTheme } = useTheme()

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="set-light" onClick={() => setTheme("light")}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme("dark")}>
        Set Dark
      </button>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  )
}

// Helper function to render with provider
const renderWithProvider = (defaultTheme?: "light" | "dark") => {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <TestComponent />
    </ThemeProvider>,
  )
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.className = ""
  })

  describe("Default Theme", () => {
    it('should provide default theme as "dark" when no defaultTheme is specified', () => {
      renderWithProvider()

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })

    it("should use provided defaultTheme", () => {
      renderWithProvider("light")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    it("should apply default theme class to document root", () => {
      renderWithProvider("light")

      expect(document.documentElement).toHaveClass("light")
      expect(document.documentElement).not.toHaveClass("dark")
    })
  })

  describe("Theme Setting", () => {
    it("should update theme when setTheme is called", async () => {
      const user = userEvent.setup()
      renderWithProvider("dark")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")

      await act(async() => {
        await user.click(screen.getByTestId("set-light"))
      })

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    it("should update document classes when theme changes", async () => {
      const user = userEvent.setup()
      renderWithProvider("dark")

      expect(document.documentElement).toHaveClass("dark")

      await act(async() => {
        await user.click(screen.getByTestId("set-light"))
      });

      expect(document.documentElement).toHaveClass("light")
      expect(document.documentElement).not.toHaveClass("dark")
    })

    it("should remove previous theme class when switching themes", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      expect(document.documentElement).toHaveClass("light")

      await act(async() => {
        await user.click(screen.getByTestId("set-dark"))
      });
      

      expect(document.documentElement).toHaveClass("dark")
      expect(document.documentElement).not.toHaveClass("light")
    })
  })

  describe("Theme Toggling", () => {
    it("should toggle from light to dark", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      });

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })

    it("should toggle from dark to light", async () => {
      const user = userEvent.setup()
      renderWithProvider("dark")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")

      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      });

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    it("should toggle multiple times correctly", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      // Start with light
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

      // Toggle to dark
      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      });
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")

      // Toggle back to light
      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      })
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

      // Toggle to dark again
      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      });

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })

    it("should update document classes when toggling", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      expect(document.documentElement).toHaveClass("light")

      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
      })

      expect(document.documentElement).toHaveClass("dark")
      expect(document.documentElement).not.toHaveClass("light")
    })
  })

  describe("DOM Manipulation", () => {
    it("should clean up previous classes before applying new ones", async () => {
      const user = userEvent.setup()

      // Manually add both classes to simulate edge case
      document.documentElement.classList.add("light", "dark", "some-other-class")

      renderWithProvider("light")

      // Should remove both theme classes and add only the current one
      expect(document.documentElement).toHaveClass("light")
      expect(document.documentElement).not.toHaveClass("dark")
      expect(document.documentElement).toHaveClass("some-other-class") // Other classes preserved
    })

    it("should handle rapid theme changes", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      // Rapidly toggle themes
      await act(async() => {
        await user.click(screen.getByTestId("toggle-theme"))
        await user.click(screen.getByTestId("toggle-theme"))
        await user.click(screen.getByTestId("toggle-theme"))
      })
      

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
      expect(document.documentElement).toHaveClass("dark")
      expect(document.documentElement).not.toHaveClass("light")
    })
  })

  describe("Provider Context", () => {
    it("should provide all required context values", () => {
      const TestContextComponent = () => {
        const context = useTheme()

        return (
          <div>
            <span data-testid="has-theme">{typeof context.theme}</span>
            <span data-testid="has-setTheme">{typeof context.setTheme}</span>
            <span data-testid="has-toggleTheme">{typeof context.toggleTheme}</span>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <TestContextComponent />
        </ThemeProvider>,
      )

      expect(screen.getByTestId("has-theme")).toHaveTextContent("string")
      expect(screen.getByTestId("has-setTheme")).toHaveTextContent("function")
      expect(screen.getByTestId("has-toggleTheme")).toHaveTextContent("function")
    })

    it("should maintain theme state across re-renders", () => {
      const { rerender } = renderWithProvider("light")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

      // Re-render the component
      rerender(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      )

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })
  })

  describe("Error Handling", () => {
    it("should throw error when useTheme is used outside ThemeProvider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

      const TestComponentWithoutProvider = () => {
        useTheme()
        return <div>Should not render</div>
      }

      expect(() => {
        render(<TestComponentWithoutProvider />)
      }).toThrow("useTheme must be used within a ThemeProvider")

      consoleSpy.mockRestore()
    })
  })

  describe("Hook Usage", () => {
    it("should work correctly when used as a hook", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe("light")
      expect(typeof result.current.setTheme).toBe("function")
      expect(typeof result.current.toggleTheme).toBe("function")
    })

    it("should update hook values when theme changes", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe("light")

      act(() => {
        result.current.setTheme("dark")
      })

      expect(result.current.theme).toBe("dark")
    })

    it("should toggle correctly when used as hook", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe("light")

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe("dark")

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe("light")
    })
  })

  describe("Edge Cases", () => {
    it("should handle setting the same theme multiple times", async () => {
      const user = userEvent.setup()
      renderWithProvider("light")

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

      // Set light theme multiple times
      await user.click(screen.getByTestId("set-light"))
      await user.click(screen.getByTestId("set-light"))
      await user.click(screen.getByTestId("set-light"))

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
      expect(document.documentElement).toHaveClass("light")
    })

    it("should handle provider with children prop spread", () => {
      const props = { defaultTheme: "dark" as const }

      render(
        <ThemeProvider {...props}>
          <TestComponent />
        </ThemeProvider>,
      )

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })
  })
})
