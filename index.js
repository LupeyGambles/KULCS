const apiUrl = "https://cge-api.onrender.com/serverinfo"; // your API endpoint

async function fetchServerInfo() {
  const statusEl = document.getElementById("status");
  const playersTable = document.getElementById("players");
  const tbody = playersTable.querySelector("tbody");
  const errorEl = document.getElementById("error");

  try {
    const res = await fetch(apiUrl);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Invalid JSON (ngrok confirmation page, HTML, etc.)
      errorEl.textContent = "⚠️ Cannot fetch server data. Make sure FastAPI is running and ngrok is confirmed.";
      statusEl.textContent = "Server data unavailable";
      playersTable.style.display = "none";
      console.error("Invalid JSON response:", text);
      return;
    }

    if (data.error) {
      errorEl.textContent = data.error;
      statusEl.textContent = "Server data unavailable";
      playersTable.style.display = "none";
      return;
    }

    // Clear previous error
    errorEl.textContent = "";

    // Display server info
    statusEl.innerHTML = `
      <b>${data.server_name || "Unknown Server"}</b><br>
      Map: ${data.map || "Unknown"} | Players: ${data.players || 0}/${data.max_players || 0}
    `;

    // Ensure players_list is always an array
    const players = Array.isArray(data.players_list) ? data.players_list : [];

    // Clear previous rows
    tbody.innerHTML = "";

    if (players.length > 0) {
      players.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.name || "Unnamed"}</td>
          <td>${p.score || 0}</td>
          <td>${p.duration ? (p.duration / 60).toFixed(1) : 0}</td>
        `;
        tbody.appendChild(row);
      });
      playersTable.style.display = "table";
    } else {
      tbody.innerHTML = `<tr><td colspan="3">No player data available</td></tr>`;
      playersTable.style.display = "table";
    }

  } catch (err) {
    errorEl.textContent = "Error fetching data: " + err;
    statusEl.textContent = "Server data unavailable";
    playersTable.style.display = "none";
    console.error(err);
  }
}

// Initial fetch and auto-refresh every 10 seconds
fetchServerInfo();
setInterval(fetchServerInfo, 10000);
