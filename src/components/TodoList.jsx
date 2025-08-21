import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onRemove, onEdit }) {
  return (
    <ul className="grid gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
