console.log("Javascript Loaded");

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3308/getUserTasks")
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // data is all the tasks from the table, i need to specify user
      loadHTMLTable(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
let i = 0;
let idNow = null;
function loadHTMLTable(data) {
  const mainDiv = document.querySelector(".mainDiv");
  mainDiv.innerHTML = "";
  let taskNb = 0; // Initialize taskNb variable

  if (data.length === 0) {
    mainDiv.innerHTML =
      "<div class='outerTasksDiv'><div class='taskListDiv'><h1 class='noTasksMsg'>No Tasks Yet...</h1></div></div>";
    return;
  } else {
    const outerDiv = document.querySelector("div");
    const taskListDiv = document.querySelector("div");
    const newTaskDiv = document.querySelector("div");

    outerDiv.appendChild(taskListDiv);

    let idText = document.querySelector("h1");

    data.forEach((task) => {
      Object.values(task).forEach((value) => {
        console.log(task);
        console.log(value);
        idText.textContent = "test";
        newTaskDiv.appendChild(idText);

        taskNb += 1;
        taskListDiv.appendChild(newTaskDiv);
      });
    });
  }
}
