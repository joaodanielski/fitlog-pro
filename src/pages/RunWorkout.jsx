import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ArrowLeft, CheckCircle2, Circle, Timer, X } from "lucide-react";

export function RunWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado do Timer
  const [restSeconds, setRestSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Busca dados
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("workout_id", id)
        .order("created_at", { ascending: true });

      // Adicionamos um estado local "done" para cada exercício
      setExercises(data?.map((ex) => ({ ...ex, done: false })) || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  // Lógica do Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((s) => s - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restSeconds]);

  function toggleSet(index) {
    const newExercises = [...exercises];
    newExercises[index].done = !newExercises[index].done;
    setExercises(newExercises);

    // Se marcou como feito, inicia descanso de 60s (padrão)
    if (newExercises[index].done) {
      setRestSeconds(60);
      setIsTimerRunning(true);
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-50 pb-32">
      {/* Header Compacto */}
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-zinc-400">
          <ArrowLeft />
        </button>
        <span className="font-bold text-emerald-500 flex items-center gap-2">
          <Timer size={18} />
          Em Treino
        </span>
        <div className="w-6" /> {/* Espaçador */}
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        {exercises.map((ex, i) => (
          <div
            key={ex.id}
            onClick={() => toggleSet(i)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              ex.done
                ? "bg-emerald-950/30 border-emerald-900 opacity-50"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div>
              <h3
                className={`font-bold text-lg ${ex.done ? "text-emerald-500 line-through" : "text-white"}`}
              >
                {ex.name}
              </h3>
              <p className="text-zinc-400">
                {ex.sets} x {ex.reps} • {ex.weight}kg
              </p>
            </div>

            <div
              className={`text-emerald-500 transition-transform ${ex.done ? "scale-110" : "scale-100 opacity-20"}`}
            >
              {ex.done ? <CheckCircle2 size={32} /> : <Circle size={32} />}
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl mt-8"
        >
          Finalizar Treino
        </button>
      </main>

      {/* Overlay do Timer (Aparece só quando rodando) */}
      {isTimerRunning && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-6 rounded-t-3xl shadow-2xl z-50 animate-in slide-in-from-bottom">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">
              Descanso
            </p>

            <div className="text-6xl font-mono font-bold text-white tabular-nums">
              {formatTime(restSeconds)}
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setRestSeconds((s) => s + 30)}
                className="flex-1 bg-zinc-800 py-3 rounded-lg font-medium hover:bg-zinc-700"
              >
                +30s
              </button>
              <button
                onClick={() => setRestSeconds(0)} // Pular
                className="flex-1 bg-emerald-600 py-3 rounded-lg font-bold text-black hover:bg-emerald-500"
              >
                Vamos!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
