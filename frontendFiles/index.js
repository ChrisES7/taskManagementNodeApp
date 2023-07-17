// const loginBtn = document.querySelector("#loginBtn");
// const registerBtn = document.querySelector("#registerBtn");
//
// if (registerBtn) {
// }

const buttons = document.querySelectorAll(".custom-button");

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
    // Perform actions for Button 1
  } else if (buttonType === "registerBtn") {
    console.log("Register");
    // Perform actions for Button 2
  }
}
