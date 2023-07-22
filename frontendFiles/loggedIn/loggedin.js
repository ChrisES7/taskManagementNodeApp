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
  let valueNb = 0;
  const length = 30;

  if (data.length === 0) {
    mainDiv.innerHTML =
      "<div class='outerTasksDiv'><div class='taskListDiv'><h1 class='noTasksMsg'>No Tasks Yet...</h1></div></div>";
    return;
  } else {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("outerTasksDiv");
    const taskListDiv = document.createElement("div");
    taskListDiv.classList.add("taskListDiv");
    const newTaskDiv = document.createElement("div");
    newTaskDiv.classList.add("newTaskDiv");

    const showMore = document.createElement("a");
    showMore.textContent = "Open Full Task";

    const stickDiv = document.createElement("div");
    stickDiv.classList.add("stickDiv");

    const taskTitleDescDiv = document.createElement("div");

    outerDiv.appendChild(taskListDiv);

    data.forEach((task) => {
      // console.log("TSSK OUTSIDE : ");
      // console.log(task);
      Object.values(task).forEach((value) => {
        // for each task, not foreach value
        // console.log("TASK :");
        // console.log(task); //task is the object
        // console.log("VALUE :");
        // console.log(value); // sends each value ("chores")
        // idText.textContent = "test";
        // newTaskDiv.appendChild(idText);
        switch (
          valueNb // i need beautiful fonts,color palettes and animations
        ) {
          case 0:
            console.log("USER_ID : " + value);
            break;
          case 1:
            console.log("TASK_ID : " + value);
            const taskIdDiv = document.createElement("div");
            const taskId = document.createElement("h1");
            taskId.textContent = value;
            taskIdDiv.appendChild(taskId);
            newTaskDiv.appendChild(taskIdDiv);
            break;
          case 2:
            console.log("TASK_TITLE : " + value);
            // for every task, you can click on a button

            const taskTitleDiv = document.createElement("div");
            const taskTitle = document.createElement("h1");

            console.log("LENGTH : " + value.length);
            if (value.length > length) {
              //at the end, add ... and append show more link
              taskTitle.textContent = value.substr(0, length) + "\u2026";
            } else {
              taskTitle.textContent = value;
            }

            taskTitleDiv.appendChild(taskTitle);
            taskTitleDescDiv.appendChild(taskTitleDiv);
            break;
          case 3:
            console.log("TASK DESCRIPTION : " + value);
            const taskDescDiv = document.createElement("div");
            const taskDesc = document.createElement("h2");
            if (value.length > length) {
              //at the end, add ... and append show more link
              taskDesc.textContent = value.substr(0, length) + "\u2026";
            } else {
              taskDesc.textContent = value;
            }
            taskDescDiv.appendChild(taskDesc);
            taskTitleDescDiv.appendChild(taskDescDiv);
            //if value more than 30 characters, add a ...,then read more pop ups a prompt window
            newTaskDiv.appendChild(taskTitleDescDiv);
            newTaskDiv.appendChild(stickDiv);
            break;
          case 4:
            console.log("DAY CREATED : " + value);
            break;
          case 5:
            console.log("TO BE DONE BY : " + value);
            const doneByDiv = document.createElement("div");
            const doneByDate = document.createElement("h2");
            doneByDate.textContent = value;
            doneByDiv.appendChild(doneByDate);
            break;
        }
        //i could even choose to not display every value, and have a show more button where i would take the id, then do a fetch with javascript and ...you know
        valueNb += 1;
        // taskNb += 1;
        taskListDiv.appendChild(newTaskDiv);
      });
      document.querySelector(".mainDiv").appendChild(outerDiv);
      valueNb = 0; // resets before going to second task
    });
    document.body.appendChild(outerDiv);
  }
}
