let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

function showRandomQuote() {
    if (quotes.length === 0) {
        alert("No quotes available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.textContent = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].author}`;
}

function addQuote(text, author) {
    const newQuote = {
        id: Date.now(),
        text,
        author,
        updatedAt: new Date().toISOString()
    };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote); // 👈 Send new quote to the mock server
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function createAddQuoteForm() {
    const form = document.createElement("form");
    form.innerHTML = `
        <input type="text" id="quoteText" placeholder="Enter quote" required />
        <input type="text" id="quoteAuthor" placeholder="Author" required />
        <button type="submit">Add Quote</button>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("quoteText").value;
        const author = document.getElementById("quoteAuthor").value;
        addQuote(text, author);
        alert("Quote added and synced with server!");
        form.reset();
    });

    document.body.appendChild(form);
}

function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quotes.json";
    link.click();
}

/* -------------------------------
   🛰️ TASK 3: Server Sync + Conflict Handling
-------------------------------- */

// 🔹 Simulate fetching quotes from a mock API
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverData = await response.json();

        // Convert fake data to our quote structure
        const serverQuotes = serverData.slice(0, 5).map((item) => ({
            id: item.id,
            text: item.title,
            author: "Server",
            updatedAt: new Date().toISOString(),
        }));

        syncQuotes(serverQuotes);
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

// 🔹 Simulate sending (POST) data to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });

        const data = await response.json();
        console.log("Quote successfully posted to server:", data);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

// 🔹 Conflict Resolution: server data wins
function syncQuotes(serverQuotes) {
    let updated = false;

    serverQuotes.forEach((serverQuote) => {
        const localQuote = quotes.find((q) => q.id === serverQuote.id);
        if (!localQuote) {
            quotes.push(serverQuote);
            updated = true;
        } else if (new Date(serverQuote.updatedAt) > new Date(localQuote.updatedAt)) {
            Object.assign(localQuote, serverQuote);
            updated = true;
        }
    });

    if (updated) {
        alert("Quotes synced with server!");
    }


}

// 🔹 Periodically sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// 🔹 Initialize app
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    document.getElementById("showQuoteBtn").addEventListener("click", showRandomQuote);
    document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotes);

    // Fetch initial quotes from server
    fetchQuotesFromServer();
});
