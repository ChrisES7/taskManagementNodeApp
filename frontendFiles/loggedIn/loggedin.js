console.log("Javascript Loaded");

document.addEventListener("DOMContentLoaded", function () {
  fetch(`http://localhost:3308/getUserTasks/1`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // data is all the tasks from the table, i need to specify user
      loadHTMLTable(data);
    })
    .catch((error) => {
      console.error(error);
    });

  // fetch
});
let i = 0;
let idNow = null;
function loadHTMLTable(data) {
  const mainDiv = document.querySelector(".mainDiv");
  mainDiv.innerHTML = "";
  let taskNb = 0; // Initialize taskNb variable
  let valueNb = 0;
  const length = 30;

  const welcomeBack = document.querySelector("#welcomeBack");
  // find a way to get username from other table
  console.log(data[0].user_id);
  const currentUserId = data[0].user_id;
  fetch(`http://localhost:3308/getUsername/${currentUserId}`)
    .then((response) => response.json())
    .then((dataUsername) => {
      // console.log(dataUsername);
      const username = dataUsername[0].username; // data is all the tasks from the table, i need to specify user
      welcomeBack.textContent = `Welcome back ${username} ! Here are your tasks.`;
      // console.log(username);
    })
    .catch((error) => {
      console.error(error);
    });

  if (data.length === 0) {
    mainDiv.innerHTML =
      "<div class='outerTasksDiv'><div class='taskListDiv'><h1 class='noTasksMsg'>No Tasks Yet...</h1></div></div>";
    return;
  } else {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("outerTasksDiv");
    const taskListDiv = document.createElement("div");
    taskListDiv.classList.add("taskListDiv");
    const mainDiv = document.querySelector(".mainDiv");

    outerDiv.appendChild(taskListDiv);

    // <iframe
    //   src="page1.html"
    //   name="targetframe"
    //   allowTransparency="true"
    //   scrolling="no"
    //   frameborder="0"
    // ></iframe>;
    // add iframe of the edit page,which is an html of itself
    // in that html i have sent a edit/userid/taskId
    let userId = null;
    data.forEach((task) => {
      // console.log("TSSK OUTSIDE : ");
      // console.log(task);

      const newTaskDiv = document.createElement("div");
      newTaskDiv.classList.add("newTaskDiv");
      const newTaskDivDiv = document.createElement("div");
      newTaskDivDiv.classList.add("newTaskDivDiv");
      newTaskDivDiv.appendChild(newTaskDiv);

      const showMoreDiv = document.createElement("div");
      const showMore = document.createElement("a");
      showMore.textContent = "Open Full Task";
      showMore.classList.add("showMore");

      showMoreDiv.classList.add("showMoreDiv");
      showMoreDiv.appendChild(showMore);
      newTaskDivDiv.appendChild(showMoreDiv);

      const stickDiv = document.createElement("div");
      stickDiv.classList.add("stickDiv");
      const horizontalStickDiv = document.createElement("div");
      horizontalStickDiv.classList.add("horizontalStickDiv");

      const taskTitleDescDiv = document.createElement("div");

      const taskOptionsDiv = document.createElement("div");
      taskOptionsDiv.classList.add("taskOptionsDiv");

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
            console.log(userId);
            userId = value;
            console.log(userId);
            break;
          case 1:
            console.log("TASK_ID : " + value);
            const taskIdDiv = document.createElement("div");
            const taskId = document.createElement("h1");
            taskId.textContent = value;
            taskIdDiv.appendChild(taskId);
            taskIdDiv.classList.add("taskIdDiv");
            newTaskDiv.appendChild(taskIdDiv);
            console.log(taskId);
            showMore.setAttribute("id", taskId.textContent);
            break;
          case 2:
            console.log("TASK_TITLE : " + value);
            // for every task, you can click on a button

            const taskTitleDiv = document.createElement("div");
            const taskTitle = document.createElement("h2");

            console.log("LENGTH : " + value.length);
            if (value.length > length) {
              //at the end, add ... and append show more link
              taskTitle.textContent = value.substr(0, length) + "\u2026";
            } else {
              taskTitle.textContent = value;
            }

            taskTitleDiv.appendChild(taskTitle);
            taskTitleDiv.classList.add("taskTitleDiv");
            taskTitleDescDiv.appendChild(taskTitleDiv);
            taskTitleDescDiv.classList.add("taskTitleDescDiv");
            taskTitleDescDiv.appendChild(horizontalStickDiv);
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
            taskDescDiv.classList.add("taskDescDiv");
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
            // doneByDate.textContent = value;
            doneByDate.textContent = value.substr(0, 10);
            doneByDiv.appendChild(doneByDate);
            // change format to 2023 on top, switch case to make the month into a word, then the day
            newTaskDiv.appendChild(doneByDiv);
            break;
        }
        //i could even choose to not display every value, and have a show more button where i would take the id, then do a fetch with javascript and ...you know
        valueNb += 1;
        // taskNb += 1;
      });
      taskOptionsDiv.appendChild(newTaskDivDiv);
      taskListDiv.appendChild(taskOptionsDiv);
      mainDiv.appendChild(outerDiv);
      valueNb = 0; // resets before going to second task
      console.log(userId);
      showMore.addEventListener("click", (event) => {
        let taskId = event.target.id;
        console.log(taskId);
        console.log(userId);
        popupEdit(userId, taskId);
      });
    });
    document.body.appendChild(mainDiv);
  }
}

function popupEdit(user_id, task_id) {
  // from here, i have the task id, so i can display
  // (dateToBeDoneBy,title,description) and a submit button in the form
  // when user submits, take every element, put it in its own
  // variable and put the variables in a data object,in json format
  //
  //

  fetch(`http://localhost:3308/getUserTasks/${user_id}`)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data); // data is all the tasks from the table, i need to specify user
      getTaskData(data);
    })
    .catch((error) => {
      console.error(error);
    });

  function getTaskData(data) {
    data.forEach((task) => {
      if (task.taskId == task_id) {
        Object.values(task).forEach((value) => {
          console.log("valueee = " + value);
        });
      }
    });
  }
}
