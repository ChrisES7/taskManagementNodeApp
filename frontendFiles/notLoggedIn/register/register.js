// const createUserBtn = document.querySelector(
//   "#createUserForm input[type='submit']"
// );

// const createUserBtn = document.querySelector(
//   "input[name='submitRegisterUser']"
// );

const createUserForm = document.querySelector("#createUserForm");
let passwordInput = document.querySelector('input[name="passwordRegistered"]');
let emailInput = document.querySelector('input[name="emailRegistered"]');
let usernameInput = document.querySelector('input[name="usernameRegistered"]');

function addError(div, field) {
  const errorMessage = document.createElement("p");
  let nbChildren = div.childElementCount;
  errorMessage.textContent = `${field} must contain at least one uppercase letter`;
  errorMessage.style.color = "red";
  errorMessage.id = "errorRegister";
  if (div.hasChildNodes()) {
    if (nbChildren == 3) {
      if (div.children[2].id == "errorRegister") {
        div.removeChild(div.children[2]);
        div.appendChild(errorMessage);
      } else {
        div.appendChild(errorMessage);
      }
    } else {
      console.log("Have a nice day!");
    }
  } else {
  }
}

createUserForm.addEventListener("submit", (e) => {
  // USERNAME
  const usernameValue = usernameInput.value;
  const userPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
  if (userPattern.test(usernameValue)) {
    event.preventDefault(); // Prevent the form from submitting
    const usernameDiv = document.querySelector("#username");
    addError(usernameDiv, "Username");
  }
  // EMAIL
  const emailValue = emailInput.value;
  let emailPattern = /^[A-Za-z0-9]+@[A-Za-z]+.[A-Za-z]{3}$/;
  if (emailPattern.test(emailValue)) {
    event.preventDefault(); // Prevent the form from submitting
    const emailDiv = document.querySelector("#email");
    addError(emailDiv, "Email");
  }
  // PASSWORD
  const passwordValue = passwordInput.value;
  let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (passwordPattern.test(passwordValue)) {
    event.preventDefault(); // Prevent the form from submitting
    const passwordDiv = document.querySelector("#password");
    addError(passwordDiv, "Password");
  }

  break;
});
