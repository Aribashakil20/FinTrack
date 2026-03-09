import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'FinTrack – Finance Tracker',
  description: 'Track income, expenses and budgets — for students, families, individuals.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
