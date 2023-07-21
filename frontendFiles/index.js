// const loginBtn = document.querySelector("#loginBtn");
// const registerBtn = document.querySelector("#registerBtn");
//
// if (registerBtn) {
// }
console.log("HELLLLOO");
const buttons = document.querySelectorAll(".custom-button");
const form = document.querySelector("#decideForm");

// Add event listener to all buttons
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

// Event listener function for button clicks
function handleButtonClick(event) {
  const buttonType = event.target.getAttribute("data-button");

  // Perform actions based on button type
  if (buttonType === "loginBtn") {
    console.log("Login");
    form.action = "/login";
    form.method = "GET";
    // Perform actions for Button 1
  } else if (buttonType === "registerBtn") {
    console.log("Register");
    form.action = "/register";
    form.method = "GET";
    // Perform actions for Button 2
    // fetch("http://localhost:3308/register")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }
}

console.log("Javascript Loaded");

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3308/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // data is all the tasks
      loadHTMLTable(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
let i = 0;
let idNow = null;
function loadHTMLTable(data) {
  const mainDiv = document.querySelector("div");
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
