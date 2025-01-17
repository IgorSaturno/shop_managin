import './global.css'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider'
import { router } from './routes'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="vibrante-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | Vibrante" />
        <Toaster richColors />
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
