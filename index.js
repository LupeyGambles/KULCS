  async function fetchServerInfo() {
      try {
        const res = await fetch("https://cge-api.onrender.com/serverinfo");

        const text = await res.text(); // read as text first

        let data;
        try {
          data = JSON.parse(text); // try parsing JSON
        } catch {
          // ngrok confirm page or other HTML
          document.getElementById("error").textContent = 
            "⚠️ Cannot fetch server data. Make sure FastAPI is running and you clicked 'Confirm' on ngrok first.";
          document.getElementById("status").textContent = "Server data unavailable";
          document.getElementById("players").style.display = "none";
          console.error("Invalid JSON response:", text);
          return;
        }

        // Check if the API returned an error
        if (data.error) {
          document.getElementById("error").textContent = data.error;
          document.getElementById("status").textContent = "Server data unavailable";
          document.getElementById("players").style.display = "none";
          return;
        }

        // Clear any previous error
        document.getElementById("error").textContent = "";

        document.getElementById("status").innerHTML = `
          <b>${data.server_name}</b><br>
          Map: ${data.map} | Players: ${data.players}/${data.max_players}
        `;

        const tbody = document.querySelector("#players tbody");
        tbody.innerHTML = "";
        if (data.players_list && data.players_list.length > 0) {
          data.players_list.forEach(p => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${p.name || "Unnamed"}</td>
              <td>${p.score}</td>
              <td>${(p.duration / 60).toFixed(1)}</td>
            `;
            tbody.appendChild(row);
          });
          document.getElementById("players").style.display = "table";
        } else {
          document.getElementById("players").style.display = "none";
        }

      } catch (err) {
        document.getElementById("error").textContent = "Error fetching data: " + err;
        document.getElementById("status").textContent = "Server data unavailable";
        document.getElementById("players").style.display = "none";
      }
    }

    // Initial fetch and repeated every 10 seconds
    fetchServerInfo();
    setInterval(fetchServerInfo, 10000);