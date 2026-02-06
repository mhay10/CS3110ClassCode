document.addEventListener("DOMContentLoaded", (event) => {
  // DOM elements
  const itemDescInput = document.querySelector("#itemdesc");
  const addItemButton = document.querySelector("#additem");
  const todoList = document.querySelector("#todolist");
  const todoItemTemplate = document.querySelector("#todoitem-template");

  // Add item button event listener
  addItemButton.addEventListener("click", (event) => {
    // Stop default form submission
    event.preventDefault();

    // Make sure input isn't empty
    const desc = itemDescInput.value.trim();
    if (desc === "") return;

    // Clone template and populate it
    const newItem = todoItemTemplate.content.cloneNode(true);
    newItem.querySelector(".itemdesc").textContent = desc;
    todoList.appendChild(newItem);

    // Clear input field
    itemDescInput.value = "";
  });

  // Todo list item checkbox event listener
  todoList.addEventListener("change", (event) => {
    // Make sure event is from a checkbox
    if (!event.target.classList.contains("itemstatus")) return;

    // Get parent todo item element
    const item = event.target.parentElement;

    // Show delete button if item is checked
    const deleteButton = item.querySelector(".deletebutton");
    deleteButton.classList.toggle("hidden");
  });

  // Todo list delete button event listener
  todoList.addEventListener("click", (event) => {
    // Stop propagation to prevent parent click events from firing
    event.stopPropagation();

    // Make sure event is from a delete button
    if (!event.target.classList.contains("deletebutton")) return;

    // Get parent todo item element and remove it
    const item = event.target.parentElement;
    item.remove();
  });
});
