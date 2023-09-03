// const loginBtn = document.querySelector("#loginBtn");
// const registerBtn = document.querySelector("#registerBtn");
//
// if (registerBtn) {
// }
console.log("HELLLLOO");
const buttons = document.querySelectorAll(".custom-button");
const form = document.querySelector(".decideForm");

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
