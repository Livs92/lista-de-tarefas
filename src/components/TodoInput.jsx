import { useId, useState } from "react";

const priorities = [
  { value: 0, label: "Normal" },
  { value: 1, label: "Alta" },
  { value: 2, label: "Urgente" },
];

export default function TodoInput({
  onAdd,
  onSearch,
  currentSearch,
  sortBy,
  onChangeSort,
}) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState(0);
  const [tags, setTags] = useState("");

  function submit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const todo = {
      id: crypto.randomUUID(),
      title: t,
      completed: false,
      createdAt: Date.now(),
      dueAt: dueAt ? new Date(dueAt).getTime() : null,
      priority: Number(priority),
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onAdd(todo);
    setTitle("");
    setDueAt("");
    setPriority(0);
    setTags("");
  }

  return (
    <div className="mb-6 grid gap-3">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur ring-1 ring-white/10">
          <span className="text-zinc-300 text-sm">🔎</span>
          <input
            id="search"
            value={currentSearch}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-zinc-300"
            placeholder="Buscar por título ou #tags…"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur ring-1 ring-white/10">
          <span className="text-zinc-300 text-sm">↕️</span>
          <select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value)}
            className="bg-transparent outline-none text-sm"
            title="Ordenação"
          >
            <option value="createdAt-desc">Mais recentes</option>
            <option value="dueAt-asc">Vencimento (mais próximas)</option>
            <option value="priority-desc">Prioridade (maior primeiro)</option>
          </select>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-2 bg-white/10 rounded-2xl p-3 backdrop-blur ring-1 ring-white/10"
      >
        <label htmlFor={titleId} className="sr-only">
          Nova tarefa
        </label>
        <div className="flex items-center gap-2">
          <input
            id="todo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-zinc-300"
            placeholder="O que precisa ser feito?"
          />
          <button
            type="submit"
            className="rounded-xl px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-sm font-medium text-zinc-900"
          >
            Adicionar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-zinc-900/40 rounded-lg px-3 py-2 ring-1 ring-white/10">
            <span>📅</span>
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="bg-transparent outline-none w-full"
              title="Data de vencimento"
            />
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/40 rounded-lg px-3 py-2 ring-1 ring-white/10">
            <span>🚩</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-transparent outline-none w-full"
              title="Prioridade"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/40 rounded-lg px-3 py-2 ring-1 ring-white/10">
            <span>🏷️</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="tags separadas por vírgula"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
