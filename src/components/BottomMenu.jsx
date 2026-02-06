import { Link, useLocation } from "react-router-dom";
import { Dumbbell, History, LineChart } from "lucide-react";

export function BottomMenu() {
  const location = useLocation();

  // Função auxiliar para saber se o link está ativo
  const isActive = (path) =>
    location.pathname === path
      ? "text-emerald-500"
      : "text-zinc-500 hover:text-zinc-300";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 p-2 ${isActive("/dashboard")}`}
        >
          <Dumbbell size={24} />
          <span className="text-[10px]">Treinos</span>
        </Link>

        <Link
          to="/history"
          className={`flex flex-col items-center gap-1 p-2 ${isActive("/history")}`}
        >
          <History size={24} />
          <span className="text-[10px]">Histórico</span>
        </Link>

        <Link
          to="/stats"
          className={`flex flex-col items-center gap-1 p-2 ${isActive("/stats")}`}
        >
          <LineChart size={24} />
          <span className="text-[10px]">Evolução</span>
        </Link>
      </div>
    </nav>
  );
}
