import React, { useState, useEffect } from "react";
import "./App.css";
import APIHelper from "./APIHelper.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("No command output")

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

  const runCommand = async e => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    await APIHelper.runCommand(command);
    const todoList = await APIHelper.getAllTodos();
    setTodos([...todoList]);
  }

  const createTodo = async e => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`);
      return;
    }
    const todoList = await APIHelper.createTodo(todo);
    console.log(todoList);
    setTodos([...todoList]);
  };

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      const todoList = await APIHelper.deleteTodo(todos[id].title);
      setTodos([...todoList]);
    } catch (err) { }
  };

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    let todoList
    if (todos[id].completed === 'true') {
      todoList = await APIHelper.markComplete(todos[id].title);
    }
    else {
      todoList = await APIHelper.markIncomplete(todos[id].title);
    }

    setTodos(todoList);

  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={todo}
          onChange={({ target }) => setTodo(target.value)}
          placeholder="Enter a todo"
        />
        <button type="button" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul>
        {todos.length ? todos.map(({ title, completed }, i) => (
          <li
            key={i}
            onClick={e => updateTodo(e, i)}
            className={completed ? "completed" : ""}
          >
            {title} <span onClick={e => deleteTodo(e, i)}>X</span>
          </li>
        )) : <p>No Todos Yet :(</p>}
      </ul>
      <div>
        <input
          type="text"
          value={command}
          onChange={({ target }) => setCommand(target.value)}
          placeholder="Enter a command"
        />
        <button type="button" onClick={createTodo}>
          Run
        </button>
      </div>
      <div>
        Command Output:
      </div>
    </div>
  );
}

export default App;
