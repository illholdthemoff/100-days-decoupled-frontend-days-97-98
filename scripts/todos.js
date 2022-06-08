const todoFormElement = document.querySelector('#todo-management form'); // grabs the html with the css element #todo-management form
const todosListElement = document.getElementById('todos-list'); // grabs the id matching todos-list

let editedTodoElement; // helper variable for later, for scoping reasons

async function loadTodos() {
  let response;
  try {
    response = await fetch('http://localhost:3000/todos'); // sends a request to this address(the todos backend). includes the localhost etc because it is sending to a different server
  } catch (error) { // if connection to server is goofed
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) { // if response otherwise fails
    alert('Something went wrong!');
    return;
  }

  const responseData = await response.json(); // parses response as json
  const todos = responseData.todos; // extracts the todos from the json responseData

  for (const todo of todos) {
    createTodoListItem(todo.text, todo.id); // loops through all todos and creates list items featuring the text and id.
  }
}

function createTodoListItem(todoText, todoId) { // creates new html, various elements and then populates them with data from the todo, id, text etc. Does this for each todo in todos
  const newTodoItemElement = document.createElement('li');
  newTodoItemElement.dataset.todoid = todoId; // data-todoid, as in a data attribute

  const todoTextElement = document.createElement('p');
  todoTextElement.textContent = todoText;

  const editTodoButtonElement = document.createElement('button');
  editTodoButtonElement.textContent = 'Edit';
  editTodoButtonElement.addEventListener('click', startTodoEditing);

  const deleteTodoButtonElement = document.createElement('button');
  deleteTodoButtonElement.textContent = 'Delete';
  deleteTodoButtonElement.addEventListener('click', deleteTodo);

  const todoActionsWrapperElement = document.createElement('div'); // creates a div for grouping purposes
  todoActionsWrapperElement.appendChild(editTodoButtonElement); // adds the buttons to the wrapper div.
  todoActionsWrapperElement.appendChild(deleteTodoButtonElement);

  newTodoItemElement.appendChild(todoTextElement); // adds the text element to the list element
  newTodoItemElement.appendChild(todoActionsWrapperElement); // attaches the button wrapper to to the list element

  todosListElement.appendChild(newTodoItemElement); // adds the list item to the list
}

async function createTodo(todoText) {
  let response;

  try {
    response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify({
        text: todoText,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  const responseData = await response.json();
  const todoId = responseData.createdTodo.id; // grabbing the id

  createTodoListItem(todoText, todoId); // new item to be added to the list using the todoid and text we grabbed.
}

async function updateTodo(newTodoText) {
  const todoId = editedTodoElement.dataset.todoid; // data-todoid like from the html dataset
  let response;

  try {
    response = await fetch('http://localhost:3000/todos/' + todoId, {
      method: 'PATCH', // patch because we are updating
      body: JSON.stringify({ // converts into a JSON string
        newText: newTodoText, // updateTodo in todos.controller is looking for newText, hence it being ehre
      }),
      headers: { // needed because we are updating a json object
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  editedTodoElement.firstElementChild.textContent = newTodoText; // updates the dom element with the new text

  todoFormElement.querySelector('input').value = ''; // clears the input field
  editedTodoElement = null; // so that you can't resubmit and so when you click it will create a new one until edit is selected again.
}

async function deleteTodo(event) {
  const clickedButtonElement = event.target;
  const todoElement = clickedButtonElement.parentElement.parentElement;
  const todoId = todoElement.dataset.todoid;

  let response;

  try {
    response = await fetch('http://localhost:3000/todos/' + todoId, { // no body needed, DELETE just needs the id.
      method: 'DELETE',
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  todoElement.remove(); // removes from the DOM
}

function saveTodo(event) {
  event.preventDefault(); // so browser does not auto generate an http request
 
  const formInput = new FormData(event.target);
  const enteredTodoText = formInput.get('text');

  if (!editedTodoElement) {
    // We're adding a new todo
    createTodo(enteredTodoText);
  } else {
    // We're updating an existing todo
    updateTodo(enteredTodoText);
  }
}

function startTodoEditing(event) {
  const clickedButtonElement = event.target;
  editedTodoElement = clickedButtonElement.parentElement.parentElement; // the <li>. this is the editedTodoElement let helper variable from top of the file.
  const currentText = editedTodoElement.firstElementChild.textContent; // the text, todoTextElement

  todoFormElement.querySelector('input').value = currentText;
}

todoFormElement.addEventListener('submit', saveTodo); // save on submit

loadTodos(); // executed on page load.