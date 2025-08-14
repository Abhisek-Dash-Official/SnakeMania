// --- Load players and current player on page load ---
window.addEventListener("load", () => {
  let players = JSON.parse(localStorage.getItem("players") || "[]");

  // If no players yet, add default player
  if (players.length === 0) {
    players = [{ name: "Player", highscore: 0 }];
    localStorage.setItem("players", JSON.stringify(players));
  }

  // Load current player
  let currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
  if (!currentPlayer) {
    currentPlayer = players[0]; // default first player
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
  }

  // Render select options
  currentPlayerSelection.innerHTML = ""; // clear existing
  players.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    currentPlayerSelection.appendChild(option);
  });

  // Set selected player
  currentPlayerSelection.value = currentPlayer.name;

  // Update current player div & highscore
  currentPlayerDiv.textContent = `Current Player: ${currentPlayer.name}`;
  highscoreDiv.textContent = `High Score ${currentPlayer.highscore} done by ${currentPlayer.name}`;
});

addPlayerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const playername = addPlayerInput.value.trim();
    if (!playername) return;

    // Add to select
    const option = document.createElement("option");
    option.value = playername;
    option.textContent = playername;
    currentPlayerSelection.appendChild(option);
    currentPlayerSelection.value = playername;

    // Update Players in Local Storage
    const players = JSON.parse(localStorage.getItem("players")) || [
      { name: "Player", highscore: 0 },
    ];
    localStorage.setItem(
      "players",
      JSON.stringify([...players, { name: playername, highscore: 0 }])
    );

    // Save as current player
    localStorage.setItem(
      "currentPlayer",
      JSON.stringify({ name: playername, highscore: 0 })
    );

    // Update display
    currentPlayerDiv.textContent = `Current Player: ${playername}`;

    // Clear input
    addPlayerInput.value = "";
  }
});

currentPlayerSelection.addEventListener("change", (e) => {
  const playername = e.target.value;
  if (!playername) return;

  let currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
  const players = JSON.parse(localStorage.getItem("players"));
  if (currentPlayer.name !== playername) {
    const idx = players.findIndex((p) => p.name === playername);
    const highscore = players[idx].highscore;
    currentPlayer = { name: playername, highscore: highscore || 0 };
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
  }

  currentPlayerDiv.textContent = `Current Player: ${currentPlayer.name}`;
  highscoreDiv.textContent = `High Score ${currentPlayer.highscore} done by ${currentPlayer.name}`;
});
