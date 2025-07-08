import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe, toHaveNoViolations } from "jest-axe"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import * as React from "react"

expect.extend(toHaveNoViolations)

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

const renderWithProvider = (defaultTheme?: "light" | "dark") => {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <TestComponent />
    </ThemeProvider>
  )
}

describe("Accessibility", () => {
  it("should have no accessibility violations in light theme", async () => {
    const { container } = renderWithProvider("light")
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("should have no accessibility violations in dark theme", async () => {
    const { container } = renderWithProvider("dark")
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("should be keyboard navigable", async () => {
    const user = userEvent.setup()
    renderWithProvider("light")

    await act(async () => {
      await user.tab()
    })
    expect(screen.getByTestId("set-light")).toHaveFocus()

    await act(async () => {
      await user.tab()
    })
    expect(screen.getByTestId("set-dark")).toHaveFocus()

    await act(async () => {
      await user.tab()
    })
    expect(screen.getByTestId("toggle-theme")).toHaveFocus()

    await act(async () => {
      await user.keyboard("[Enter]")
    })
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
  })

  it("should announce theme changes to screen readers", async () => {
    const user = userEvent.setup()

    const StatusAnnouncer = () => {
      const { theme } = useTheme()
      return (
        <div
          role="status"
          aria-live="polite"
          data-testid="status"
        >{`Theme changed to ${theme}`}</div>
      )
    }

    render(
      <ThemeProvider defaultTheme="light">
        <>
          <TestComponent />
          <StatusAnnouncer />
        </>
      </ThemeProvider>
    )

    await act(async () => {
      await user.click(screen.getByTestId("toggle-theme"))
    })

    expect(screen.getByTestId("status")).toHaveTextContent("Theme changed to dark")
  })

  it("should respect prefers-color-scheme", () => {
    const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    window.matchMedia = matchMediaMock

    const { getByTestId } = renderWithProvider()

    expect(getByTestId("current-theme")).toHaveTextContent("dark")
  })
})
