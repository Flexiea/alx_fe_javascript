// ==========================
// Task 0: Base Setup
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Dynamic Content Generator loaded!");

  // Create main container
  const app = document.createElement("div");
  app.id = "app";
  document.body.appendChild(app);

  // Header
  const header = document.createElement("h1");
  header.textContent = "Dynamic Quote Generator";
  app.appendChild(header);

  // Quote display area
  const quoteDisplay = document.createElement("p");
  quoteDisplay.id = "quoteDisplay";
  quoteDisplay.textContent = "Click below to get a random quote!";
  app.appendChild(quoteDisplay);

  // Buttons container
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";
  app.appendChild(btnContainer);

  // Random Quote Button
  const randomBtn = document.createElement("button");
  randomBtn.textContent = "Show Random Quote";
  randomBtn.addEventListener("click", showRandomQuote);
  btnContainer.appendChild(randomBtn);

  // Add Quote Button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add New Quote";
  addBtn.addEventListener("click", addNewQuote);
  btnContainer.appendChild(addBtn);

  // Sync Button
  const syncBtn = document.createElement("button");
  syncBtn.textContent = "Sync with Server";
  syncBtn.addEventListener("click", fetchQuotesFromServer);
  btnContainer.appendChild(syncBtn);

  // Status Message
  const status = document.createElement("p");
  status.id = "status";
  app.appendChild(status);
});

// ==========================
// Task 1: Random Quotes
// ==========================

const quotes = [
  "The best way to predict the future is to create it.",
  "Do something today that your future self will thank you for.",
  "Dream big. Start small. Act now.",
  "Every moment is a fresh beginning.",
  "Don’t wait for opportunity. Create it."
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
  console.log("Random quote shown:", quotes[randomIndex]);
}

// ==========================
// Task 2: Add New Quote
// ==========================

function addNewQuote() {
  const newQuote = prompt("Enter your new quote:");
  if (newQuote && newQuote.trim() !== "") {
    quotes.push(newQuote.trim());
    console.log("New quote added:", newQuote);
    showStatus("New quote added successfully!");
  } else {
    showStatus("Quote not added. Input was empty.");
  }
}

// ==========================
// Task 3: Fetch / Sync with Server
// ==========================

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotes })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Quotes synced with server!", data);
      showStatus("Quotes synced with server!");
    } else {
      console.error("Server error:", response.status);
      showStatus("Server error while syncing quotes.");
    }
  } catch (error) {
    console.error("Network error:", error);
    showStatus("Network error while syncing.");
  }
}

// ==========================
// Helper Function
// ==========================

function showStatus(message) {
  const status = document.getElementById("status");
  status.textContent = message;
  setTimeout(() => (status.textContent = ""), 3000);
}
