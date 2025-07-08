![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/github/license/BarryPiccinni/dark-mode-switch)
![Tests](https://img.shields.io/badge/tests-100%25-success)

# 🌗 Theme Toggle Demo

A simple, accessible Next.js demo app showcasing a **light/dark mode toggle** built with React, Tailwind CSS, and Radix UI. The app is designed with accessibility and testability in mind, supporting keyboard navigation, screen readers, and system theme preference detection.

## ✨ Features

- 🌓 Toggle between light and dark themes  
- ⚙️ Respects system `prefers-color-scheme`  
- ♿️ Keyboard-accessible and screen reader-friendly  
- 🎨 Built with Tailwind CSS and `class-variance-authority`  
- 🧪 Fully tested with `jest`, `@testing-library/react`, and `jest-axe`

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/theme-toggle-demo.git
cd theme-toggle-demo
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Running Tests

### Unit + Accessibility Tests

```bash
npm test
```

### Watch mode

```bash
npm run test:watch
```

### Coverage report

```bash
npm run test:coverage
```

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI:** [React](https://reactjs.org/), [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [tailwindcss-animate](https://github.com/joe-bell/tailwindcss-animate)
- **Utility:** `class-variance-authority`, `clsx`
- **Testing:** `jest`, `@testing-library/react`, `jest-axe`

---

## 📁 Project Structure

```
components/
  ├── theme-provider.tsx       # Manages theme context
  └── theme-toggle.tsx         # The toggle button
tests/
  └── accessibility            # Accessibility tests
    └── a11y.test.tsx 
  └── components               # Toggle tests
    |── theme-provider.test.tsx 
    └── theme-toggle.test.tsx   
pages/
  └── index.tsx                # Demo page
```

---

## 📦 Scripts

| Script                  | Description                   |
|-------------------------|-------------------------------|
| `npm run dev`           | Start local dev server        |
| `npm run build`         | Build for production          |
| `npm run start`         | Start production server       |
| `npm run lint`          | Run ESLint                    |
| `npm test`              | Run test suite                |
| `npm run test:watch`    | Watch files and test          |
| `npm run test:coverage` | Show test coverage            |

---

## 📄 License

MIT — free to use and modify.

---
