const TodosApp = {
  data() {
    return {
      isLoading: false,
      todos: [],
      enteredTodoText: "", // attached to the html via the v-model in the html. We can make this prefilled on the html by entering a value here. TWO WAY BINDING
      editedTodoId: null,
    }; // object must be returned
  }, // to add methods directly to an object. data is a keyword for vue.
  methods: {
    async saveTodo(event) {
      // listens for an event specified on the html page, such as @submit, and then calls this
      event.preventDefault(); // ensures browser will not do its default behavior of sending an http request

      if (this.editedTodoId) {
        // if the editedId exists, updating
        const todoId = this.editedTodoId; // need to have this here because we can't use 'this' like below due to it being in an anonymous function

        let response;

        try {
          response = await fetch("http://localhost:3000/todos/" + todoId, {
            method: "PATCH", // patch because we are updating
            body: JSON.stringify({
              // converts into a JSON string
              newText: this.enteredTodoText, // updateTodo in todos.controller is looking for newText, hence it being ehre
            }),
            headers: {
              // needed because we are updating a json object
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const todoIndex = this.todos.findIndex(function (todoItem) {
          return todoItem.id === todoId;
        }); // similar to find but just returns the index of the array item as opposed to the array item itself

        const updatedTodoItem = {
          // technically a new item, but will be using the id of the old one we are replacing
          id: this.todos[todoIndex.id], // keeping the id the same
          text: this.enteredTodoText, // changes text based on whatever was entered
        }; // creates brand new object in memory which ensures vue will pick up the change as soon as we replace the existing item with this updated one.

        this.todos[todoIndex] = updatedTodoItem; // replaces the old todo in todoIndex with the updated one
        this.editedTodoId = null; // so that the next time we enter into an input we arent automatically editing an existing one.
      } else {
        //creating new
        let response;

        try {
          response = await fetch("http://localhost:3000/todos", {
            // connecting to server
            method: "POST", // posting to server
            body: JSON.stringify({
              // converting to json readable string
              text: this.enteredTodoText,
            }),
            headers: {
              "Content-Type": "application/json", // header type json
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const responseData = await response.json();
        const todoId = responseData.createdTodo.id; // grabbing the id

        const newTodo = {
          text: this.enteredTodoText,
          id: todoId,
        }; // the 'this' in this case is wired up to the data section, bound to the object returned inside data() specifically.

        this.todos.push(newTodo); // pushes the newTodo into the todos array
      }

      this.enteredTodoText = ""; // clearing the input after changing newTodo, another example of 2 way binding
    },

    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId; // find is a function available to every js object/array. Here we are going through the array to find a todoItem with an id matching our todoId. If it does find the id, the item will be returned by find, and then we can update it as below
      });
      this.enteredTodoText = todo.text;
    },

    async deleteTodo(todoId) {
      this.todos = this.todos.filter(function (todoItem) {
        return todoItem.id !== todoId; // if it does NOT match the selected id, do not filter it
      }); // filters out elements in an array that return false then generates a new array with the remaining members.

      let response;

      try {
        // here we put the deletion from the DOM stuff above the delete from database below because it's better to have it visually deleted from the page, and then from the database than the other way around, not that it really matters in this case.
        response = await fetch("http://localhost:3000/todos/" + todoId, {
          // no body needed, DELETE just needs the id.
          method: "DELETE",
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!response.ok) {
        alert("Something went wrong!");
        return;
      }
    },
  }, // this is a property, not a method, despite the name.

  async created() {
    // created is a reserved name, whatever is in here will be called whenever this vue app is created (as soon as the vue code activates on page load). we CAN use async but but just know that created()/mounted() does not actually wait until its done
    let response; // helper variable
    this.isLoading = true; // set to loading temporarily while all the stuff below is loaded/connected
    try {
      response = await fetch("http://localhost:3000/todos"); // sends a request to this   address(the todos backend). includes the localhost etc because it is sending to a   different server
    } catch (error) {
      // if connection to server is goofed
      alert("Something went wrong!");
      this.isLoading = false; // loading done due to erorr
      return;
    }

    this.isLoading = false; // loading done

    if (!response.ok) {
      // if response otherwise fails
      alert("Something went wrong!");
      return;
    }

    const responseData = await response.json(); // parses response as json
    this.todos = responseData.todos; // extracts the todos from the json responseData and then updates the todos array with the data.
  },
}; //created dynamically

Vue.createApp(TodosApp).mount("#todos-app"); // mount method not defined by us, built in by Vue package. Used on object that's returned from the createApp() method (also a Vue package item). The mount allows us to connect the created app to something in the UI/html. That which is inside the arguments is a CSS selector which must be assigned somewhere in the html code. It should be on an element that contains all the elements you wnat the app to work with in the futre
