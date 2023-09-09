console.log("Javascript Loaded");

document.addEventListener("DOMContentLoaded", async function() {
  try {
    // Fetch the sessionId from the server
    console.log("Fetching session ID...");
    const sessionResponse = await fetch("/getSessionId/", {
      method: "GET"
    });
    if (sessionResponse.ok) {
      // Extract the sessionId from the response
      const sessionData = await sessionResponse.json();
      console.log("Session Data:", sessionData);
      const sessionId = sessionData.userId;

      // Now you can use the sessionId as needed
      console.log("Session ID:", sessionId);

      // Fetch user tasks using the sessionId or any other action you need
      console.log("Fetching user tasks...");
      const userTasksResponse = await fetch(
        `http://localhost:3308/getUserTasks/${sessionId}`
      );
      if (userTasksResponse.ok) {
        const userData = await userTasksResponse.json();
        // console.log(userData, sessionId);
        loadHTMLTable(userData, sessionId);
      } else {
        console.error(
          "Error fetching user tasks:",
          userTasksResponse.statusText
        );
      }
    } else {
      console.error("Error fetching session ID:", sessionResponse.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
let i = 0;
let idNow = null;

function loadHTMLTable(data, userSessionId) {
  let colorPalette = {
    blue: {
      background: "#507cf5",
      openTask: "#85a2f2",
      stickDiv: "#85a2f2",
      idNbDiv: "lightblue",
      deleteBtn: "#fd4c66",
    },
    orange: {
      background: "#fd4c66",
      openTask: "#85a2f2",
      stickDiv: "#85a2f2",
      idNbDiv: "lightblue",
      deleteBtn: "#fd4c66",
    },
    red: {
      background: "#507cf5",
      openTask: "#85a2f2",
      stickDiv: "#85a2f2",
      idNbDiv: "lightblue",
      deleteBtn: "#fd4c66",
    },
  };

  let createTaskForm = document.querySelector(".createTaskForm");
  let taskFormUserId = document.querySelector(
    ".createTaskForm input[type='hidden']"
  );
  taskFormUserId.value = userSessionId;
  let today = new Date().toISOString().split("T")[0];
  let doneByDate = document.querySelector(
    '.createTaskForm input[name="dateToBeDoneBy"]'
  );
  doneByDate.setAttribute("min", today);
  let doneByLabel = document.querySelector(".createTaskForm label");
  let inputTodayDate = document.querySelector(
    '.createTaskForm input[name="taskCreated"]'
  );
  inputTodayDate.type = "date";
  inputTodayDate.value = today;
  // inputTodayDate.disabled = "true";
  // inputTodayDate.name = "taskCreated";
  // console.log(inputTodayDate.value);
  // createTaskForm.insertBefore(inputTodayDate, doneByLabel);

  createTaskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Remove the disabled attribute to include the value in the form data
    inputTodayDate.removeAttribute("disabled");

    // Now submit the form
    createTaskForm.submit();
  });

  const mainDiv = document.querySelector(".mainDiv");
  mainDiv.innerHTML = "";
  let taskNb = 0; // Initialize taskNb variable
  let valueNb = 0;
  const length = 30;

  const welcomeBack = document.querySelector("#welcomeBack");
  // find a way to get username from other table
  // console.log(data.length);
  if (data.length == 0) {
    console.log("There are no tasks");
    //append a div element
    return;
  } else {}
  const currentUserId = userSessionId; //data[0].user_id;
  fetch(`http://localhost:3308/getUsername/${currentUserId}`)
    .then((response) => response.json())
    .then((dataUsername) => {
      // console.log(dataUsername);
      const username = dataUsername[0].username; // data is all the tasks from the table, i need to specify user
      welcomeBack.textContent =
        `Welcome back ${username} ! Here are your tasks.`;
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
    let taskIdNb = null;
    data.forEach((task) => {
      // console.log("TSSK OUTSIDE : ");

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

      const deleteBtnDiv = document.createElement("div");
      deleteBtnDiv.classList.add("deleteBtnDiv");
      const deleteBtn = document.createElement("a");
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.textContent = "Delete";
      deleteBtnDiv.appendChild(deleteBtn);

      const delShowDiv = document.createElement("div");
      delShowDiv.classList.add("delShowDiv");
      delShowDiv.appendChild(deleteBtnDiv);
      delShowDiv.appendChild(showMoreDiv);
      // showMoreDiv.appendChild(deleteBtn);
      // newTaskDivDiv.appendChild(deleteBtnDiv);
      // newTaskDivDiv.appendChild(showMoreDiv);
      newTaskDivDiv.appendChild(delShowDiv);

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
            // console.log("USER_ID : " + value);
            // console.log(userId);
            userId = value;
            // console.log(userId);
            break;
          case 1:
            console.log("TASK_ID : " + value);
            const taskIdDiv = document.createElement("div");
            const taskId = document.createElement("h1");
            taskIdNb = value;
            taskId.textContent = taskIdNb;
            taskIdDiv.appendChild(taskId);
            taskIdDiv.classList.add("taskIdDiv");
            newTaskDiv.appendChild(taskIdDiv);
            console.log(taskId);
            showMore.setAttribute("id", taskId.textContent);
            deleteBtn.setAttribute("id", taskId.textContent);
            break;
          case 2:
            console.log("TASK_TITLE : " + value);
            // for every task, you can click on a button
            const taskTitleDiv = document.createElement("div");
            const taskTitle = document.createElement("h2");
            console.log("LENGTH : " + value.length);
            if (value.length > length) {
              //at the end, add ... and append show more link
              taskTitle.textContent = value.substr(0, length) +
                "\u2026";
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

            taskDescDiv.appendChild(taskDesc);
            taskDescDiv.classList.add("taskDescDiv");
            taskTitleDescDiv.appendChild(taskDescDiv);

            if (value.length > length) {
              //at the end, add ... and append show more link
              taskDesc.textContent = value.substr(0, length) + "\u2026";
            } else if (value.length == 0) {
              horizontalStickDiv.remove();
              taskDescDiv.remove();
              // taskTitle.style.fontSize = "20pt";
              taskTitleDescDiv.style.width = "200px";
            } else {
              taskDesc.textContent = value;
            }

            //if value more than 30 characters, add a ...,then read more pop ups a prompt window
            newTaskDiv.appendChild(taskTitleDescDiv);
            newTaskDiv.appendChild(stickDiv);
            break;
          case 4:
            console.log("DAY CREATED : " + value);
            break;
          case 5:
            console.log("TO BE DONE BY : " + value);
            let today = new Date().toISOString().split("T")[0];
            const doneByDiv = document.createElement("div");
            const doneByDate = document.createElement("h2");
            // doneByDate.textContent = value;
            doneByDate.textContent = value.substr(0, 10);

            if (today > doneByDate.textContent) {
              // console.log("you failed");
              let blueColor = colorPalette.blue;
              //change everything's colors
            }
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
      // console.log(userId);
      // console.log(taskIdNb);
      showMore.addEventListener("click", (event) => {
        let taskId = event.target.id;
        // console.log(taskId);
        // console.log(userId);
        popupEdit(userId, taskId);
      });
      deleteBtn.addEventListener("click", (event) => {
        let taskId = event.target.id;
        // console.log(event.target.id);
        deleteTask(userId, taskId);
      });
    });
    document.querySelector(".taskssDiv").appendChild(mainDiv);
  }
}
// mettre variables ici

function closePopUp() {
  let filterBlur = document.querySelector(".filterBlur");
  let popUpWindow = document.querySelector(".popUpEditWindow");
  popUpWindow.style.transform = "scale(0.4)";
  // or maybe play with the scale
  popUpWindow.style.opacity = "0";
  filterBlur.style.backgroundColor = "rgba( 0, 0, 0, 0 )";
  filterBlur.style.backdropFilter = "none";
  filterBlur.style.zIndex = "-1";
  popUpWindow.style.zIndex = "-1";
  let taskDesc = document.querySelector(".textAreasDiv textarea");
}

function popupEdit(user_id, task_id) {
  // from here, i have the task id, so i can display
  // (dateToBeDoneBy,title,description) and a submit button in the form
  // when user submits, take every element, put it in its own
  // variable and put the variables in a data object,in json format
  //
  //
  let taskData = {};
  // console.log(taskData);
  let filterBlur = document.querySelector(".filterBlur");
  let popUpWindow = document.querySelector(".popUpEditWindow");

  // or maybe play with the scale
  popUpWindow.style.opacity = "100";
  popUpWindow.style.transform = "scale(1)";
  filterBlur.style.backgroundColor = "rgba( 0, 0, 0, 0.2 )";
  // filterBlur.style.backdropFilter = "blur(5px)";
  filterBlur.style.zIndex = "4";
  popUpWindow.style.zIndex = "5";
  let taskDesc = document.querySelector(".textAreasDiv textarea");
  taskDesc.setAttribute("rows", "15");
  // let closePopUpButton = document.querySelector(".closePopUp");
  fetch(`http://localhost:3308/getUserTask/${user_id}/${task_id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // data is the specific task
      getTaskData(data);
    })
    .catch((error) => {
      console.error(error);
    });

  function getTaskData(data) {
    let newTaskDesc = document.querySelector(".textAreasDiv textarea");
    let taskName = document.querySelector(
      ".textAreasDiv div input[type='text']"
    );
    const dateInputContainer = document.querySelector(".dateInputContainer");
    const createdOn = dateInputContainer.querySelector(
      'input[name="taskCreated"]'
    );

    const doneBy = dateInputContainer.querySelector('input[name="taskDoneBy"]');
    taskName.value = "";
    newTaskDesc.value = "";
    createdOn.value = "";
    doneBy.value = "";
    console.log(newTaskDesc.value + " " + taskName.value + " " + doneBy.value);
    let taskValueNb = 0;
    data.forEach((task) => {
      if (task.task_id == task_id) {
        Object.values(task).forEach((value) => {
          console.log("valueee = " + value);
          switch (taskValueNb) {
            case 2:
              taskName.value = value;
              break;
            case 3:
              // console.log(value);
              newTaskDesc.value = value;
              break;
            case 4:
              let formattedDate = value.substr(0, 10);
              createdOn.value = formattedDate;
              break;
            case 5:
              let today = new Date().toISOString().split("T")[0];
              // console.log(today);
              // console.log(value);
              doneBy.value = value.substr(0, 10);
              doneBy.setAttribute("min", today);
              break;
          }
          taskValueNb += 1;
        });
      }
    });
  }
  // rmemeber to disable all except tobedoneby
  let editButton = document.querySelector(
    ".taskEditSubmitDiv input[type='submit']"
  );
  editButton.addEventListener("click", function editTask() {
    let title = document.querySelector("input[name='taskName']").value;
    // console.log(title);
    let desc = taskDesc.value;
    // console.log(desc);
    let toBeDoneBy = document.querySelector("#doneByDate").value;
    // console.log("ATTR : " + title + " " + desc + " " + toBeDoneBy);
    taskData.taskTitle = title;
    taskData.taskDescription = desc;
    taskData.dayDoneBy = toBeDoneBy;
    // console.log(taskData);
    fetch(`http://localhost:3308/editTask/${user_id}/${task_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
      .then((response) => {
        if (response.ok) {
          // console.log("Row edited successfully");
          fetch(`http://localhost:3308/getUserTasks/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
              loadHTMLTable(data, user_id); // Reload the table with updated data
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.error("Error updating row");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function deleteTask(userId, taskId) {
  fetch(`http://localhost:3308/deleteTask/${userId}/${taskId}/`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        // console.log("Row edited successfully");
        fetch(`http://localhost:3308/getUserTasks/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            loadHTMLTable(data, userId); // Reload the table with updated data
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error("Error updating row");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
