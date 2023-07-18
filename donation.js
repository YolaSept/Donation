const addButton = document.getElementById("addButton");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const displayAmount = document.getElementById("displayAmount");
const socket = io();
const logo = document.getElementById("logo");
const pesoSign = document.getElementById("displayAmount");

let donationAmount = 0; // Only keep track of the latest donation amount

// Display initial amount with PESO sign
displayAmount.textContent = `₱${donationAmount.toFixed(2)}`;

function updateLogoPosition() {
  const amountHeight = pesoSign.offsetHeight;

  // Adjust the logo's size based on the amount
  logo.style.width = `${amountHeight}px`;
  logo.style.height = `${amountHeight}px`;

  // Calculate the left position of the logo relative to the peso sign
  const logoLeft = pesoSign.offsetLeft - amountHeight - 10;

  // Adjust the logo's position
  logo.style.position = "absolute";
  logo.style.top = `${pesoSign.offsetTop}px`;
  logo.style.left = `${logoLeft}px`;
}

addButton.addEventListener("click", function() {
  const amount = prompt("Enter donation amount:");
  if (amount) {
    donationAmount = parseFloat(amount);
    displayAmount.textContent = `₱${donationAmount.toFixed(2)}`;
    socket.emit('donation', donationAmount); // Send donation event to server

    updateLogoPosition(); // Update the logo's position
  }
});

resetButton.addEventListener("click", function() {
  donationAmount = 0;
  displayAmount.textContent = `₱${donationAmount.toFixed(2)}`;
  updateLogoPosition(); // Update the logo's position
});

saveButton.addEventListener("click", function() {
  saveDonation(donationAmount);
  donationAmount = 0;
  displayAmount.textContent = `₱${donationAmount.toFixed(2)}`;
  updateLogoPosition(); // Update the logo's position
});

function saveDonation(amount) {
  fetch("/donations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Donation saved successfully");
      } else {
        alert("Failed to save donation");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to save donation");
    });
}

updateLogoPosition();
