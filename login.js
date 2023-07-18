document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.text())
    .then(data => {
      if (data.includes("User not found")) {
        alert("User not found");
      } else if (data.includes("Invalid password")) {
        alert("Invalid password");
      } else {
        window.location.href = "/homepage";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Login failed");
    });
});
