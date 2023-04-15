import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import usePrevious from "./Utils/helper";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import Todo from "./components/Todo";

const FILTER_MAP = {
  All: () => true,
  Completed: (task) => task.completed,
  Incomplete: (task) => !task.completed,
};

const FILTER_NAME = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  const prevTasksLength = usePrevious(tasks.length);
  const listHeadingRef = useRef(null);

  function addTask(name) {
    const newTask = {
      id: `task-${nanoid()}`,
      name,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, completed: !task.completed };
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function editTask(id, name) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, name: name };
      return task;
    });
    setTasks(updatedTasks);
  }

  const filterList = FILTER_NAME.map((name) => (
    <FilterButton
      name={name}
      key={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const taskNoun = taskList.length === 1 ? "task" : "tasks";
  const heading = `${taskList.length} ${taskNoun} remaining`;

  useEffect(() => {
    if (tasks.length - prevTasksLength === -1) listHeadingRef.current.focus();
  }, [tasks.length, prevTasksLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {heading}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
