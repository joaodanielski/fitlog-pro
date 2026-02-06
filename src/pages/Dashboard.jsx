import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Bem-vindo ao FitLog!</h1>
        <p className="text-zinc-400">Logado como: {user?.email}</p>
        
        <button 
          onClick={signOut}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Sair do App
        </button>
      </div>
    </div>
  )
}