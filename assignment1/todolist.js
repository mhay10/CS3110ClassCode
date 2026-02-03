document.addEventListener("DOMContentLoaded", (event) => {
  const itemDescInput = document.querySelector("#itemdesc");
  const addItemButton = document.querySelector("#additem");
  const todoList = document.querySelector("#todolist");
  const todoItemTemplate = document.querySelector("template");

  addItemButton.addEventListener("click", (event) => {
    const desc = itemDescInput.value.trim();
    if (desc === "") return;

    console.log(`Adding item: ${desc}`);
  });
});
