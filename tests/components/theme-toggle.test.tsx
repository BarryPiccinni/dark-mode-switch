import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const Wrapper = () => {
  const { theme } = useTheme()
  return (
    <>
      <span data-testid="current-theme">{theme}</span>
      <ThemeToggle />
    </>
  )
}

const renderWithProvider = (defaultTheme: "light" | "dark" = "light") =>
  render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <Wrapper />
    </ThemeProvider>
  )

describe("ThemeToggle", () => {
  it("renders without crashing", () => {
    renderWithProvider()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("toggles theme when clicked", async () => {
    const user = userEvent.setup()
    renderWithProvider("light")

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light")

    await act(async () => {
      await user.click(screen.getByRole("button"))
    })

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
  })

  it("toggles theme when activated via keyboard", async () => {
    const user = userEvent.setup()
    renderWithProvider("light")

    await act(async () => {
      await user.tab()
    })

    expect(screen.getByRole("button")).toHaveFocus()

    await act(async () => {
      await user.keyboard("[Enter]")
    })

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
  })
})