const list = document.getElementById("list");
const todoText = document.getElementById("todoText");

let allTodos = JSON.parse(localStorage.getItem("allTodos")) || [];
console.log(allTodos);


let cnt = 0;

allTodos.forEach((item) => {
	const newListItem = document.createElement("li");
	newListItem.innerHTML = item;
  newListItem.classList.add("list-item");
  // newListItem.id = "listItem" + cnt;
  cnt++;

  newListItem.setAttribute("draggable", "true");

	const newicon = document.createElement("i");
	newicon.classList.add("hidden");
	newicon.classList.add("far");
	newicon.classList.add("fa-trash-alt");
	newListItem.appendChild(newicon);
  list.appendChild(newListItem);

	newicon.addEventListener("click", () => {
		allTodos.splice(allTodos.indexOf(item), 1);
    list.removeChild(newListItem);
    cnt--;
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
	});
});

todoText.addEventListener("keydown", (e) => {
	// console.log(e.key);
	if (e.key == "Enter") {
		const newListItem = document.createElement("li");
		newListItem.innerHTML = todoText.value;
    newListItem.classList.add("list-item");
    
    newListItem.setAttribute("draggable", "true");

    newListItem.addEventListener("dragstart", () => {
      console.log("dragstart");
      newListItem.classList.add("dragging");
    });
  
    newListItem.addEventListener("dragend", () => {
      console.log("dragend");
      console.log(allTodos);
      newListItem.classList.remove("dragging");
    });

		const newicon = document.createElement("i");
		newicon.classList.add("hidden");
		newicon.classList.add("far");
		newicon.classList.add("fa-trash-alt");

    newicon.addEventListener("click", () => {
      // console.log(allTodos.indexOf(newListItem.innerText))
      allTodos.splice(allTodos.indexOf(newListItem.innerText) , 1);
      list.removeChild(newListItem);
      cnt--;
			localStorage.setItem("allTodos", JSON.stringify(allTodos));
		});

		allTodos.push(todoText.value);
		console.log(allTodos);
		localStorage.setItem("allTodos", JSON.stringify(allTodos));

		todoText.value = "";

		newListItem.appendChild(newicon);
    list.appendChild(newListItem);
    

    newListItem.addEventListener("dragstart", dragStart);
    newListItem.addEventListener("dragend", dragEnd);
	}
});

const todoItem = document.querySelectorAll(".list-item");
const container = document.querySelector(".list");

todoItem.forEach((item) => {
  item.addEventListener("dragstart", () => {
    console.log("dragstart");
    item.classList.add("dragging");
  });

  item.addEventListener("dragend", () => {
    console.log("dragend");
    console.log(allTodos);
    item.classList.remove("dragging");
  });
})

const dragAfter = (container, y) => {
  const draggable_el = [...container.querySelectorAll('.list-item:not(.dragging)')]
  return draggable_el.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    // console.log(offset);
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    }
    else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

const updateArray = (afterElement, draggable) => {
  let draggableText = draggable.innerText;

  if (afterElement == null) {
    allTodos.splice(allTodos.indexOf(draggableText), 1)
    
    allTodos.push(draggableText);
  }
  else {
    let afterElementText = afterElement.innerText;
    allTodos.splice(allTodos.indexOf(draggableText), 1)
    allTodos.splice(allTodos.indexOf(afterElementText), 0, draggableText)
  }
}

container.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = dragAfter(container, e.clientY);
  // console.log(afterElement);
  const draggable = document.querySelector('.dragging');

  if (afterElement == null) {
    container.appendChild(draggable);
  }
  else {
    container.insertBefore(draggable, afterElement)
  }

  updateArray(afterElement, draggable);
});


// container.addEventListener('dragenter', dragEnter);
// container.addEventListener('dragleave', dragLeave);
// container.addEventListener('drop', dragDrop);
