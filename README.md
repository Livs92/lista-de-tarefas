Lista de Tarefas — React + Vite + Tailwind

✨ Funcionalidades

✅ Adicionar, editar, concluir e excluir tarefas

🔎 Busca por título e #tags

🏷️ Tags (separadas por vírgula)

🚩 Prioridade (Normal, Alta, Urgente)

📅 Data de vencimento (com destaque para atraso)

🔁 Filtros: Todas / Pendentes / Concluídas

↕️ Ordenação: Mais recentes / Vencimento / Prioridade

💾 Persistência automática (localStorage)

🎨 UI com gradiente frio (azul/índigo/ciano) e glassmorphism

📱 Responsivo

🧰 Tecnologias

React + Vite

TailwindCSS (com PostCSS/Autoprefixer)

🚀 Como rodar

Passo a passo para criar o projeto com Vite + React (JavaScript) e Tailwind.

# 1) criar o projeto

npm create vite@latest todo-react

# selecione: React → JavaScript

cd todo-react

# 2) instalar deps do Tailwind v3

npm i -D tailwindcss@3.4.13 postcss autoprefixer

# 3) gerar configs

npx tailwindcss init -p

# (no Windows, se o npx falhar:)

# .\node_modules\.bin\tailwindcss.cmd init -p

# 4) instalar deps do projeto (se o template ainda não instalou)

npm install

# 5) rodar

npm run dev
