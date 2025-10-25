const apiUrl = "https://cge-api.onrender.com/serverinfo";

async function fetchServerInfo() {
  const statusEl = document.getElementById("status");
  const playersTable = document.getElementById("players");
  const tbody = playersTable.querySelector("tbody");
  const errorEl = document.getElementById("error");

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    // Display server info
    statusEl.innerHTML = `
      <b>${data.server_name || "Unknown"}</b><br>
      Map: ${data.map || "Unknown"} | Players: ${data.players || "Unknown"}/${data.max_players || "Unknown"}
    `;

    // Always display players
    const players = Array.isArray(data.players_list) ? data.players_list : [{"name": "Unknown", "score": 0, "duration": 0}];

    tbody.innerHTML = "";
    players.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.name || "Unknown"}</td>
        <td>${p.score || 0}</td>
        <td>${p.duration ? (p.duration / 60).toFixed(1) : 0}</td>
      `;
      tbody.appendChild(row);
    });

    playersTable.style.display = "table";
    errorEl.textContent = "";

  } catch (err) {
    // If fetch fails entirely, show unknowns
    statusEl.textContent = "Server data unavailable";
    tbody.innerHTML = `
      <tr><td>Unknown</td><td>0</td><td>0</td></tr>
    `;
    playersTable.style.display = "table";
    errorEl.textContent = "Error fetching data: " + err;
    console.error(err);
  }
}

// Initial fetch and refresh every 10 seconds
fetchServerInfo();
setInterval(fetchServerInfo, 10000);
