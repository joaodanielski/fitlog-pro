import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { BottomMenu } from "../components/BottomMenu";
import { LineChart as ChartIcon, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Stats() {
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Carregar lista de exercícios disponíveis no histórico
  useEffect(() => {
    async function fetchUniqueNames() {
      // Truque do Supabase para pegar nomes distintos é usando .csv ou processando no front
      // Vamos pegar todos e filtrar no JS para simplificar
      const { data } = await supabase
        .from("exercise_history")
        .select("exercise_name");

      // Remover duplicatas
      const names = [...new Set(data?.map((i) => i.exercise_name))];
      setUniqueExercises(names.sort());
      if (names.length > 0) setSelectedExercise(names[0]);
    }
    fetchUniqueNames();
  }, []);

  // 2. Carregar dados do exercício selecionado
  useEffect(() => {
    if (!selectedExercise) return;

    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from("exercise_history")
        .select("weight, created_at")
        .eq("exercise_name", selectedExercise)
        .order("created_at", { ascending: true });

      // Formatar para o gráfico
      const formatted = data?.map((item) => ({
        date: new Date(item.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        carga: parseFloat(item.weight),
      }));

      setChartData(formatted || []);
      setLoading(false);
    }
    fetchData();
  }, [selectedExercise]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-24">
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ChartIcon className="text-emerald-500" />
          Evolução de Carga
        </h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Seletor de Exercício */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Selecione o exercício:
          </label>
          <div className="relative">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg appearance-none focus:border-emerald-500 outline-none"
            >
              {uniqueExercises.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500">
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 h-64">
          {loading ? (
            <p className="text-center text-zinc-500 mt-20">Carregando...</p>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Line
                  type="monotone"
                  dataKey="carga"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-zinc-500 mt-20">
              Sem dados suficientes.
            </p>
          )}
        </div>

        <p className="text-xs text-center text-zinc-500">
          O gráfico mostra a evolução da carga (kg) ao longo do tempo.
        </p>
      </main>

      <BottomMenu />
    </div>
  );
}
