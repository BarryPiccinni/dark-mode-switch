"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ThemeDemo() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header with theme toggle */}
      <div className="flex justify-end p-6">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Light & Dark Mode</h1>
          </div>

          {/* Interactive elements */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code2 className="w-5 h-5" />
                <span>Interactive Elements</span>
              </CardTitle>
              <CardDescription>See how buttons and cards adapt to the current theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="transition-all duration-300 hover:scale-105">Primary</Button>
                <Button variant="outline" className="transition-all duration-300 hover:scale-105 bg-transparent">
                  Outline
                </Button>
                <Button variant="secondary" className="transition-all duration-300 hover:scale-105">
                  Secondary
                </Button>
                <Button variant="ghost" className="transition-all duration-300 hover:scale-105">
                  Ghost
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-mono">
                  <span className="text-primary">Current theme:</span> <span className="font-semibold">"{theme}"</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
