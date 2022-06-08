const TodosApp = {
  data() {
    return {
      newTodo: "Learn Vue.js!",
      enteredTodoText: "", // attached to the html via the v-model in the html. We can make this prefilled on the html by entering a value here. TWO WAY BINDING
    }; // object must be returned
  }, // to add methods directly to an object. data is a keyword for vue.
  methods: {
    saveTodo(event) {
      // listens for an event specified on the html page, such as @submit, and then calls this
      event.preventDefault(); // ensures browser will not do its default behavior of sending an http request
      this.newTodo = this.enteredTodoText; // the 'this' in this case is wired up to the data section, bound to the object returned inside data() specifically.
      this.enteredTodoText = ""; // clearing the input after changing newTodo, another example of 2 way binding
    },
  }, // this is a property, not a method, despite the name.
}; //created dynamically

Vue.createApp(TodosApp).mount("#todos-app"); // mount method not defined by us, built in by Vue package. Used on object that's returned from the createApp() method (also a Vue package item). The mount allows us to connect the created app to something in the UI/html. That which is inside the arguments is a CSS selector which must be assigned somewhere in the html code. It should be on an element that contains all the elements you wnat the app to work with in the futre
