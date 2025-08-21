import { useEffect, useMemo, useReducer } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Filters from "./components/Filters";
import Stats from "./components/Stats";
import EmptyState from "./components/EmptyState";

const initial = {
  todos: [],
  filter: "all",
  search: "",
  sortBy: "createdAt-desc",
};

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, todos: [action.payload, ...state.todos] };
    case "toggle":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? Date.now() : null,
              }
            : t
        ),
      };
    case "remove":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case "edit":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.patch } : t
        ),
      };
    case "filter":
      return { ...state, filter: action.filter };
    case "search":
      return { ...state, search: action.search };
    case "sort":
      return { ...state, sortBy: action.sortBy };
    case "bulk:clearDone":
      return { ...state, todos: state.todos.filter((t) => !t.completed) };
    default:
      return state;
  }
}

export default function App() {
  // carrega do localStorage na inicialização do reducer
  const [persisted, setPersisted] = useLocalStorage("todo-state-v1", initial);
  const [state, dispatch] = useReducer(reducer, persisted ?? initial);

  // salva no localStorage sempre que o estado mudar
  useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  // stats
  const stats = useMemo(() => {
    const total = state.todos.length;
    const done = state.todos.filter((t) => t.completed).length;
    const active = total - done;
    return { total, done, active };
  }, [state.todos]);

  // lista visível (busca, filtro, ordenação)
  const visibleTodos = useMemo(() => {
    let list = [...state.todos];

    const q = state.search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        `${t.title} ${t.tags?.join(" ")}`.toLowerCase().includes(q)
      );
    }

    if (state.filter === "active") list = list.filter((t) => !t.completed);
    if (state.filter === "done") list = list.filter((t) => t.completed);

    const cmp = {
      "createdAt-desc": (a, b) => b.createdAt - a.createdAt,
      "dueAt-asc": (a, b) => (a.dueAt ?? 9e15) - (b.dueAt ?? 9e15),
      "priority-desc": (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    }[state.sortBy];

    return list.sort(cmp);
  }, [state.todos, state.filter, state.search, state.sortBy]);

  return (
    <div className="min-h-screen text-zinc-100 bg-gradient-to-br from-sky-950 via-indigo-950 to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Título + stats */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow
                         bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Lista de Tarefas
          </h1>
          <Stats
            {...stats}
            onClearDone={() => dispatch({ type: "bulk:clearDone" })}
          />
        </header>

        {/* Entrada + busca + ordenação */}
        <TodoInput
          onAdd={(todo) => dispatch({ type: "add", payload: todo })}
          onSearch={(s) => dispatch({ type: "search", search: s })}
          currentSearch={state.search}
          sortBy={state.sortBy}
          onChangeSort={(sortBy) => dispatch({ type: "sort", sortBy })}
        />

        {/* Filtros */}
        <Filters
          value={state.filter}
          onChange={(filter) => dispatch({ type: "filter", filter })}
        />

        {/* Lista / vazio */}
        {visibleTodos.length === 0 ? (
          <EmptyState hasTodos={state.todos.length > 0} />
        ) : (
          <TodoList
            todos={visibleTodos}
            onToggle={(id) => dispatch({ type: "toggle", id })}
            onRemove={(id) => dispatch({ type: "remove", id })}
            onEdit={(id, patch) =>
              dispatch({ type: "edit", payload: { id, patch } })
            }
          />
        )}

        <footer className="mt-10 text-xs text-zinc-300/80">
          Atalhos: <kbd className="px-1 rounded bg-white/10">Ctrl + K</kbd>{" "}
          (adicionar) • <kbd className="px-1 rounded bg-white/10">Ctrl + F</kbd>{" "}
          (buscar)
        </footer>
      </div>
    </div>
  );
}
