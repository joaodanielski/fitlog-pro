import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { BottomMenu } from "../components/BottomMenu";
import { CalendarCheck, Loader2 } from "lucide-react";

export function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data } = await supabase
        .from("workout_history")
        .select("*")
        .order("finished_at", { ascending: false });
      setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-24">
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CalendarCheck className="text-emerald-500" />
          Histórico
        </h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">
            Nenhum treino finalizado ainda.
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-white">{item.workout_name}</h3>
                <p className="text-xs text-zinc-500">
                  {new Date(item.finished_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
      <BottomMenu />
    </div>
  );
}
