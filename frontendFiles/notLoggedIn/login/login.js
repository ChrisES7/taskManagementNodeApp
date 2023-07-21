// const loginForm = document.getElementById("loginForm");
//
// // Assuming you're using fetch API for making HTTP requests
// loginForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const formData = new FormData(event.target); //login form
//   const credentials = {
//     username: formData.get("username"),
//     password: formData.get("password"),
//   };
//
//   try {
//     const response = await fetch("/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(credentials),
//     });
//
//     if (response.ok) {
//       // Login successful, redirect or perform desired actions
//       window.location.href = "/";
//       // fetch;
//     } else {
//       // Login failed, display error message to the user
//       alert("Invalid username or password. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error occurred:", error);
//     alert("An error occurred during login. Please try again later.");
//   }
// });
