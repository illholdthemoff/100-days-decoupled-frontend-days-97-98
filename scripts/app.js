const TodosApp = {
  data() {
    return {
      todos: [],
      enteredTodoText: "", // attached to the html via the v-model in the html. We can make this prefilled on the html by entering a value here. TWO WAY BINDING
      editedTodoId: null,
    }; // object must be returned
  }, // to add methods directly to an object. data is a keyword for vue.
  methods: {
    saveTodo(event) {
      // listens for an event specified on the html page, such as @submit, and then calls this
      event.preventDefault(); // ensures browser will not do its default behavior of sending an http request

      if (this.editedTodoId) {
        // if the editedId exists, updating
        const todoId = this.editedTodoId; // need to have this here because we can't use 'this' like below due to it being in an anonymous function
        const todoIndex = this.todos.findIndex(function(todoItem) {
          return todoItem.id === todoId;
        }); // similar to find but just returns the index of the array item as opposed to the array item itself

        const updatedTodoItem = { // technically a new item, but will be using the id of the old one we are replacing
          id: this.todos[todoIndex.id], // keeping the id the same
          text: this.enteredTodoText, // changes text based on whatever was entered
        }; // creates brand new object in memory which ensures vue will pick up the change as soon as we replace the existing item with this updated one.

        this.todos[todoIndex] = updatedTodoItem; // replaces the old todo in todoIndex with the updated one
        this.editedTodoId = null; // so that the next time we enter into an input we arent automatically editing an existing one.
      } else {
        //creating new
          const newTodo = {
           text: this.enteredTodoText,
           id: new Date().toISOString() // converts the timestamp to a machine readable string
          }; // the 'this' in this case is wired up to the data section, bound to the object returned inside data() specifically.
        this.todos.push(newTodo); // pushes the newTodo into the todos array

      }

      
      this.enteredTodoText = ""; // clearing the input after changing newTodo, another example of 2 way binding
    },
    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const todo = this.todos.find(function(todoItem) {
        return todoItem.id === todoId; // find is a function available to every js object/array. Here we are going through the array to find a todoItem with an id matching our todoId. If it does find the id, the item will be returned by find, and then we can update it as below
      });
      this.enteredTodoText = todo.text;
    }
  }, // this is a property, not a method, despite the name.
}; //created dynamically

Vue.createApp(TodosApp).mount("#todos-app"); // mount method not defined by us, built in by Vue package. Used on object that's returned from the createApp() method (also a Vue package item). The mount allows us to connect the created app to something in the UI/html. That which is inside the arguments is a CSS selector which must be assigned somewhere in the html code. It should be on an element that contains all the elements you wnat the app to work with in the futre
