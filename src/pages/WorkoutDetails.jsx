import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // <--- O Link estava aqui?
import { supabase } from "../services/supabase";
import { ArrowLeft, Plus, Trash2, Play } from "lucide-react";

export function WorkoutDetails() {
  const { id } = useParams();

  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para novo exercício
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: "10",
    weight: "0",
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      // 1. Pegar nome do treino
      const { data: workout } = await supabase
        .from("workouts")
        .select("name")
        .eq("id", id)
        .single();
      if (workout) setWorkoutName(workout.name);

      // 2. Pegar exercícios
      const { data: list } = await supabase
        .from("exercises")
        .select("*")
        .eq("workout_id", id)
        .order("created_at", { ascending: true });

      setExercises(list || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExercise(e) {
    e.preventDefault();
    if (!newExercise.name) return;

    try {
      const { data, error } = await supabase
        .from("exercises")
        .insert([{ ...newExercise, workout_id: id }])
        .select();

      if (error) throw error;

      setExercises([...exercises, data[0]]);
      setIsAdding(false);
      setNewExercise({ name: "", sets: 3, reps: "10", weight: "0" }); // Reset
    } catch (error) {
      alert("Erro ao adicionar.");
      console.error(error);
    }
  }

  async function handleDelete(exerciseId) {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId);
    if (!error) {
      setExercises(exercises.filter((ex) => ex.id !== exerciseId));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10 flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2 -ml-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft />
        </Link>
        <h1 className="font-bold text-lg truncate">
          {loading ? "Carregando..." : workoutName}
        </h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Botão de Iniciar Treino */}
        <Link
          to={`/run/${id}`}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
        >
          <Play size={20} fill="currentColor" />
          INICIAR TREINO
        </Link>

        {/* Lista de Exercícios */}
        <div className="space-y-3">
          {exercises.length === 0 && !loading && (
            <p className="text-center text-zinc-500 py-4 text-sm">
              Nenhum exercício cadastrado ainda.
            </p>
          )}

          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{ex.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {ex.sets} séries x {ex.reps} reps • {ex.weight}kg
                </p>
              </div>
              <button
                onClick={() => handleDelete(ex.id)}
                className="text-zinc-600 hover:text-red-500 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Formulário de Adição */}
        {isAdding ? (
          <form
            onSubmit={handleAddExercise}
            className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 space-y-3 animate-in fade-in"
          >
            <input
              autoFocus
              className="w-full bg-zinc-950 p-2 rounded border border-zinc-700 text-white"
              placeholder="Nome do exercício (ex: Supino)"
              value={newExercise.name}
              onChange={(e) =>
                setNewExercise({ ...newExercise, name: e.target.value })
              }
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-zinc-500">Séries</label>
                <input
                  type="number"
                  className="w-full bg-zinc-950 p-2 rounded border border-zinc-700"
                  value={newExercise.sets}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, sets: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Reps</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 p-2 rounded border border-zinc-700"
                  value={newExercise.reps}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, reps: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Carga (kg)</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 p-2 rounded border border-zinc-700"
                  value={newExercise.weight}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, weight: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 text-black font-bold py-2 rounded"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-zinc-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/50 flex flex-col items-center gap-2 transition-all"
          >
            <Plus />
            <span>Adicionar Exercício</span>
          </button>
        )}
      </main>
    </div>
  );
}
