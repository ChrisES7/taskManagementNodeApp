const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target); //login form
  console.log(`${formData.get("username")}`);
  try {
    const response = await fetch(
      `http://localhost:3308/getUserId/${formData.get("username")}`
    );
    const data = await response.json();
    // Extract the user_id value from the response data
    console.log(data);
    const userId = data[0].user_id;
    console.log(userId);
    console.log(formData.get("username"));
    const credentials = makeCreds(
      formData.get("username"),
      formData.get("password"),
      userId
    );

    const loginResponse = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (loginResponse.ok) {
      const responseJson = await loginResponse.json();
      const userId = responseJson.userId;

      // Now you can use the userId variable as needed
      console.log("User ID:", userId);
      // Login successful, redirect or perform desired actions
      window.location.href = `/?valid=loggedIn`;
      console.log("OK");
    } else {
      // Login failed, display error message to the user
      alert("Invalid username or password. Please try again.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    alert("An error occurred during login. Please try again later.");
  }
});

function makeCreds(username, password, userId) {
  const credentials = {
    username: username,
    password: password,
    user_id: userId,
  };
  return credentials;
}
