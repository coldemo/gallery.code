/** @jsx createElement */
// import {createElement, Fragment} from "@bikeshaving/crank";
// import {renderer} from "@bikeshaving/crank/dom";

await loadCss([
  'https://unpkg.com/todomvc-common@1.0.5/base.css',
  'https://unpkg.com/todomvc-app-css@2.3.0/index.css', // too aggressive
])

// await loadJs('https://unpkg.com/@bikeshaving/crank/umd/index.js');
await loadJs('https://unpkg.com/crank-umd@0.1.1/umd/index.js');
const {Fragment, createElement, renderer} = Crank;

appendCss(`
#mountNode { padding: 20px }
body { max-width: none !important; } /* against todomvc-app-css */
`);

/* temp hack for coldemo logic */
// const prefix = '#/playground/crank-todomvc.jsx';
const prefix = window.location.hash.replace(/\/+$/, '');

// https://github.com/bikeshaving/crank/tree/master/examples/todomvc
const ENTER_KEY = 13;
const ESC_KEY = 27;

function* Header() {
  let title = "";
  this.addEventListener("input", (ev) => {
    title = ev.target.value;
  });

  this.addEventListener("keydown", (ev) => {
    if (ev.target.tagName === "INPUT" && ev.keyCode === ENTER_KEY) {
      if (title.trim()) {
        ev.preventDefault();
        const title1 = title.trim();
        title = "";
        this.dispatchEvent(
          new CustomEvent("todo.create", {
            bubbles: true,
            detail: {title: title1},
          }),
        );
      }
    }
  });

  while (true) {
    yield (
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          autofocus
          value={title}
        />
      </header>
    );
  }
}

function* TodoItem({todo}) {
  let active = false;
  let title = todo.title;
  this.addEventListener("click", (ev) => {
    if (ev.target.className === "toggle") {
      this.dispatchEvent(
        new CustomEvent("todo.toggle", {
          bubbles: true,
          detail: {id: todo.id, completed: !todo.completed},
        }),
      );
    } else if (ev.target.className === "destroy") {
      this.dispatchEvent(
        new CustomEvent("todo.destroy", {
          bubbles: true,
          detail: {id: todo.id},
        }),
      );
    }
  });

  this.addEventListener("dblclick", (ev) => {
    if (ev.target.tagName === "LABEL") {
      active = true;
      this.refresh();
      ev.target.parentElement.nextSibling.focus();
    }
  });

  this.addEventListener("input", (ev) => {
    if (ev.target.className === "edit") {
      title = ev.target.value;
    }
  });

  this.addEventListener("keydown", (ev) => {
    if (
      ev.target.className === "edit" &&
      (ev.keyCode === ENTER_KEY || ev.keyCode === ESC_KEY)
    ) {
      active = false;
      title = title.trim();
      if (title) {
        this.dispatchEvent(
          new CustomEvent("todo.edit", {
            bubbles: true,
            detail: {id: todo.id, title},
          }),
        );
      } else {
        this.dispatchEvent(
          new CustomEvent("todo.destroy", {
            bubbles: true,
            detail: {id: todo.id},
          }),
        );
      }
    }
  });

  this.addEventListener(
    "blur",
    (ev) => {
      if (ev.target.className === "edit") {
        active = false;
        if (title) {
          this.dispatchEvent(
            new CustomEvent("todo.edit", {
              bubbles: true,
              detail: {id: todo.id, title},
            }),
          );
        } else {
          this.dispatchEvent(
            new CustomEvent("todo.destroy", {
              bubbles: true,
              detail: {id: todo.id},
            }),
          );
        }
      }
    },
    {capture: true},
  );

  for ({todo} of this) {
    const classes = [];
    if (active) {
      classes.push("editing");
    }
    if (todo.completed) {
      classes.push("completed");
    }

    yield (
      <li class={classes.join(" ")}>
        <div class="view">
          <input class="toggle" type="checkbox" checked={todo.completed} />
          <label>{todo.title}</label>
          <button class="destroy" />
        </div>
        <input class="edit" value={title} />
      </li>
    );
  }
}

function Main({todos, filter}) {
  const completed = todos.every((todo) => todo.completed);
  this.addEventListener("click", (ev) => {
    if (ev.target.className === "toggle-all") {
      this.dispatchEvent(
        new CustomEvent("todo.toggleAll", {
          bubbles: true,
          detail: {completed: !completed},
        }),
      );
    }
  });

  if (filter === "active") {
    todos = todos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    todos = todos.filter((todo) => todo.completed);
  }

  return (
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        checked={completed}
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        {todos.map((todo) => (
          <TodoItem todo={todo} crank-key={todo.id} />
        ))}
      </ul>
    </section>
  );
}

function Filters({filter}) {
  return (
    <ul class="filters">
      <li>
        <a class={filter === "" ? "selected" : ""} href={`${prefix}/`}>
          All
        </a>
      </li>
      <li>
        <a class={filter === "active" ? "selected" : ""} href={`${prefix}/active`}>
          Active
        </a>
      </li>
      <li>
        <a class={filter === "completed" ? "selected" : ""} href={`${prefix}/completed`}>
          Completed
        </a>
      </li>
    </ul>
  );
}

function Footer({todos, filter}) {
  const completed = todos.filter((todo) => todo.completed).length;
  const remaining = todos.length - completed;
  this.addEventListener("click", (ev) => {
    if (ev.target.className === "clear-completed") {
      this.dispatchEvent(new Event("todo.clearCompleted", {bubbles: true}));
    }
  });

  return (
    <footer class="footer">
      <span class="todo-count">
        <strong>{remaining}</strong> {remaining === 1 ? "item" : "items"} left
      </span>
      <Filters filter={filter} />
      {!!completed && <button class="clear-completed">Clear completed</button>}
    </footer>
  );
}

const STORAGE_KEY = "todos-crank";
function save(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function* App() {
  // let todos = [];
  let todos = [
    { id: 1, title: 'sports', completed: true },
    { id: 2, title: 'learn crank', completed: false },
    { id: 3, title: 'get to work', completed: false },
  ];
  let nextTodoId = 0;
  try {
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(storedTodos) && storedTodos.length) {
      todos = storedTodos;
      nextTodoId = Math.max(...storedTodos.map((todo) => todo.id)) + 1;
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    localStorage.removeItem(STORAGE_KEY);
  }

  let filter = "";
  this.addEventListener("todo.create", (ev) => {
    todos.push({id: nextTodoId++, title: ev.detail.title, completed: false});
    this.refresh();
    save(todos);
  });

  this.addEventListener("todo.edit", (ev) => {
    const i = todos.findIndex((todo) => todo.id === ev.detail.id);
    todos[i].title = ev.detail.title;
    this.refresh();
    save(todos);
  });

  this.addEventListener("todo.toggle", (ev) => {
    const i = todos.findIndex((todo) => todo.id === ev.detail.id);
    todos[i].completed = ev.detail.completed;
    this.refresh();
    save(todos);
  });

  this.addEventListener("todo.toggleAll", (ev) => {
    todos = todos.map((todo) => ({...todo, completed: ev.detail.completed}));
    this.refresh();
    save(todos);
  });

  this.addEventListener("todo.clearCompleted", () => {
    todos = todos.filter((todo) => !todo.completed);
    this.refresh();
    save(todos);
  });

  this.addEventListener("todo.destroy", (ev) => {
    todos = todos.filter((todo) => todo.id !== ev.detail.id);
    this.refresh();
    save(todos);
  });

  const route = (ev) => {
    switch (window.location.hash) {
      case `${prefix}/active`: {
        filter = "active";
        break;
      }
      case `${prefix}/completed`: {
        filter = "completed";
        break;
      }
      case `${prefix}/`: {
        filter = "";
        break;
      }
      default: {
        if (window.location.hash.startsWith(`${prefix}/`)) {
          filter = "";
          window.location.hash = `${prefix}/`;
        }
      }
    }

    if (ev != null) {
      this.refresh();
    }
  };

  route();
  window.addEventListener("hashchange", route);
  try {
    while (true) {
      yield (
        <Fragment>
          <Header />
          {!!todos.length && <Main todos={todos} filter={filter} />}
          {!!todos.length && <Footer todos={todos} filter={filter} />}
        </Fragment>
      );
    }
  } finally {
    window.removeEventListener("hashchange", route);
  }
}

// renderer.render(<App />, document.getElementsByClassName("todoapp")[0]);
renderer.render(<App />, document.querySelector("#mountNode"));

/* temp hack for coldemo logic */
App = undefined;
