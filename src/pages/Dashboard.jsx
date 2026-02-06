import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import { Plus, Trash2, Dumbbell, Calendar, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomMenu } from "../components/BottomMenu"; // <--- Importação Nova

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // 1. Buscar dados ao carregar a página
  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkouts(data);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  }

  // 2. Criar novo treino
  async function handleCreate(e) {
    e.preventDefault();
    if (!newWorkoutName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert([{ user_id: user.id, name: newWorkoutName }])
        .select();

      if (error) throw error;

      setWorkouts([data[0], ...workouts]); // Atualiza a lista localmente
      setNewWorkoutName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Erro ao criar:", error);
      alert("Erro ao criar treino.");
    }
  }

  // 3. Deletar treino
  async function handleDelete(id) {
    if (!confirm("Tem certeza? Isso apaga todos os exercícios vinculados."))
      return;

    try {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-24">
      {/* Header Fixo */}
      <header className="p-4 border-b border-zinc-800 bg-zinc-900/80 sticky top-0 backdrop-blur-md z-10 flex items-center justify-between max-w-md mx-auto w-full">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Dumbbell className="text-emerald-500 size-6" />
          Meus Treinos
        </h1>
        <button onClick={signOut} className="text-zinc-500 hover:text-white">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Botão de Adicionar (Toggle) */}
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
          >
            <Plus size={20} />
            Novo Treino
          </button>
        )}

        {/* Formulário de Criação (Animado) */}
        {isCreating && (
          <form
            onSubmit={handleCreate}
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2"
          >
            <label className="block text-sm text-zinc-400 mb-2">
              Nome da Ficha
            </label>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Ex: Treino A - Peito"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-emerald-500 text-zinc-950 font-bold px-4 rounded-lg hover:bg-emerald-400"
              >
                Salvar
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Lista de Treinos */}
        {loading ? (
          <p className="text-center text-zinc-500 py-10 animate-pulse">
            Carregando...
          </p>
        ) : workouts.length === 0 ? (
          <div className="text-center text-zinc-500 py-10 space-y-2 opacity-60">
            <p>Nenhuma ficha encontrada.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all"
              >
                <Link
                  to={`/workout/${workout.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-semibold text-lg text-zinc-100">
                    {workout.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                    <Calendar size={12} />
                    {new Date(workout.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </Link>

                <button
                  onClick={() => handleDelete(workout.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-10"
                  title="Excluir treino"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Navegação Inferior */}
      <BottomMenu />
    </div>
  );
}
