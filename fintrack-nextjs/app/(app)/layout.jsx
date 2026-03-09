'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'

export default function AppLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-lg mx-auto pb-nav">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
