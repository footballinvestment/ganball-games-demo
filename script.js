// === PLATFORM STATE ===
let platformState = {
  currentMode: "basic",
  sessionCount: parseInt(localStorage.getItem("ganball-total-sessions") || "0"),
  gameStats: JSON.parse(localStorage.getItem("ganball-game-stats") || "{}"),
};

// === GAMES CONFIGURATION ===
const GAMES_CONFIG = {
  ganfoottennis: {
    id: "ganfoottennis",
    name: "GānFoottennis",
    icon: "🎾",
    description: "Lábtenis technika generátor 269,002 kombinációval",
    features: ["partner_mode", "leaderboard"],
    combinationCount: 269002,
    status: "available",
    url: "ganfoottennis.html",
  },
  ganfootgolf: {
    id: "ganfootgolf",
    name: "GānFootgolf",
    icon: "⛳",
    description: "Precíziós láb golf kihívások és pálya generátor",
    features: ["partner_mode", "leaderboard"],
    combinationCount: 85000,
    status: "coming_soon",
    url: "#",
  },
  ganfootvolley: {
    id: "ganfootvolley",
    name: "GānFootvolley",
    icon: "🏐",
    description: "1v1 láb volleyball eszköz felett játékkal",
    features: ["partner_mode", "leaderboard"],
    combinationCount: 120000,
    status: "coming_soon",
    url: "#",
  },
  gancuju: {
    id: "gancuju",
    name: "GānCuju",
    icon: "🏺",
    description: "4000 éves ősi kínai labdarúgó technikák",
    features: ["partner_mode", "leaderboard"],
    combinationCount: 95000,
    status: "coming_soon",
    url: "#",
  },
};

// === INITIALIZATION ===
function initializePlatform() {
  // Mode toggle event listeners
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".mode-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      platformState.currentMode = this.dataset.mode;
      updatePlatformMode();
    });
  });
}

function loadGames() {
  const gamesGrid = document.getElementById("games-grid");
  gamesGrid.innerHTML = "";

  Object.values(GAMES_CONFIG).forEach((game) => {
    const gameCard = createGameCard(game);
    gamesGrid.appendChild(gameCard);
  });
}

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = `game-card ${
    game.status === "coming_soon" ? "coming-soon" : ""
  }`;

  const sessions = platformState.gameStats[game.id]?.sessions || 0;
  const lastPlayed = platformState.gameStats[game.id]?.lastPlayed;

  card.innerHTML = `
        <span class="game-icon">${game.icon}</span>
        <div class="game-title">${game.name}</div>
        <div class="game-description">${game.description}</div>
        ${
          platformState.currentMode === "partner"
            ? '<div class="partner-badge">💎 Partner Funkciók</div>'
            : ""
        }
        <div class="game-stats">
            <div class="stat-item">
                <span class="stat-number">${game.combinationCount.toLocaleString()}</span>
                <span class="stat-label">Kombináció</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${sessions}</span>
                <span class="stat-label">Szesszió</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${lastPlayed ? "Ma" : "Soha"}</span>
                <span class="stat-label">Utoljára</span>
            </div>
        </div>
    `;

  if (game.status === "available") {
    card.addEventListener("click", () => loadGame(game));
  }

  return card;
}

function updatePlatformMode() {
  document.getElementById("current-mode").textContent =
    platformState.currentMode === "partner" ? "💎 Partner" : "Alap";
  loadGames(); // Reload games to show/hide partner badges
}

function updateStats() {
  document.getElementById("total-sessions").textContent =
    platformState.sessionCount;
  document.getElementById("current-mode").textContent =
    platformState.currentMode === "partner" ? "💎 Partner" : "Alap";
}

// === GAME LOADING ===
function loadGame(game) {
  if (game.status !== "available") return;

  // Store current mode for the game
  localStorage.setItem("ganball-current-mode", platformState.currentMode);

  // Navigate to game page
  window.location.href = game.url;
}

// === PLATFORM API ===
window.GanballPlatform = {
  getCurrentMode: () => platformState.currentMode,
  updateGameStats: (gameId, newStats) => {
    platformState.gameStats[gameId] = {
      ...platformState.gameStats[gameId],
      ...newStats,
    };
    localStorage.setItem(
      "ganball-game-stats",
      JSON.stringify(platformState.gameStats)
    );
  },
  getGameConfig: (gameId) => GAMES_CONFIG[gameId],
};
