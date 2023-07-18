function validateForm() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (email === "") {
    alert("Email field is required");
    return false;
  }

  // Check for existing email
  fetch("/check-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        alert("Email is already registered");
        emailInput.value = "";
        emailInput.focus();
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred");
    });

  return false; // Prevent form submission
}
