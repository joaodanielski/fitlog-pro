import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="size-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  
  if (!user) {
    return <Navigate to="/login" />
  }

  
  return children
}