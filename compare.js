// =========================
// Parámetros de la URL
// =========================
const params = new URLSearchParams(window.location.search);
const id1 = params.get("id1");
const id2 = params.get("id2");

// Forzar dominio correcto (opcional, lo dejo como lo tenías)
if (!location.hostname.includes("internoob1.github.io")) {
    location.href = `https://internoob1.github.io${location.pathname}${location.search}`;
}

// Validar IDs
if (!id1 || !id2) {
    document.getElementById("compareContainer").innerHTML =
        "<h2 style='color:#ff5555;'>Faltan jugadores para comparar.</h2>";
    throw new Error("IDs faltantes");
}

// =========================
// Cargar datos y renderizar jugadores
// =========================
fetch("tiers_ranking.json")
    .then(r => r.json())
    .then(data => {
        const p1 = data.find(p => p.id === id1);
        const p2 = data.find(p => p.id === id2);

        if (!p1 || !p2) {
            throw new Error("Jugador no encontrado");
        }

        renderPlayer("playerA", p1, p2);
        renderPlayer("playerB", p2, p1);
    })
    .catch(err => {
        console.error(err);
        document.getElementById("compareContainer").innerHTML =
            "<h2 style='color:#ff5555;'>Error cargando comparación.</h2>";
    });

// =========================
// Render de tarjeta de jugador
// =========================
function renderPlayer(containerId, player, rival) {
    const container = document.getElementById(containerId);

    const avatarUrl = player.avatar
        ? `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${Number(player.id) % 5}.png`;

    const scoreClass = player.score > rival.score ? "winner" : "";

    container.innerHTML = `
        <div style="
            background:#0b1019;
            border:1px solid var(--border-soft);
            border-radius:14px;
            padding:20px;
            width:300px;
            text-align:center;
            box-shadow:0 0 18px rgba(0,0,0,0.6);
        ">

            <img src="${avatarUrl}" style="
                width:120px;
                height:120px;
                border-radius:12px;
                box-shadow:0 0 18px rgba(0,170,255,0.4);
            ">

            <h2 style="font-family:'Orbitron'; margin:12px 0 4px;">
                ${player.nick}
            </h2>

            <p style="color:var(--text-soft); margin:4px 0;">
                Región: <b>${player.region}</b>
            </p>

            <p class="cell-box ${scoreClass}" style="margin:10px auto;">
                Score: ${player.score}
            </p>

            <div style="margin-top:14px;">
                ${rankRow("Melee", player.meleeRank, rival.meleeRank)}
                ${rankRow("Weapons", player.weaponsRank, rival.weaponsRank)}
                ${rankRow("Mixed", player.mixedRank, rival.mixedRank)}
            </div>

            <button onclick="window.location.href='player.html?id=${player.id}'"
                style="
                    margin-top:16px;
                    padding:8px 14px;
                    border:none;
                    border-radius:8px;
                    background:linear-gradient(135deg,#0284c7,#00aaff);
                    color:white;
                    font-weight:600;
                    cursor:pointer;
                ">
                Ver perfil
            </button>
        </div>
    `;

    // Animación fade-in TIERS SF
    const card = container.firstElementChild;
    card.style.opacity = 0;
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
        card.style.transition = "0.25s ease";
        card.style.opacity = 1;
        card.style.transform = "scale(1)";
    }, 10);
}

// =========================
// Comparación de rangos
// =========================
function rankRow(label, rank, rivalRank) {
    const better = rankValue(rank) > rankValue(rivalRank);
    const extraStyle = better
        ? `
    box-shadow:
        0 0 12px rgba(0,170,255,0.9),
        0 0 24px rgba(0,170,255,0.7),
        0 0 40px rgba(0,170,255,0.5);
    transform: scale(1.08);
    z-index: 2;
`
        : "";

    return `
        <div style="margin:6px 0;">
            <span style="color:#bfc7d5;">${label}</span><br>
            <span class="rank-cell ${rank}" style="${extraStyle}">
                ${rank}
            </span>
        </div>
    `;
}

function rankValue(rank) {
    const values = {
        HT1: 60,
        LT1: 45,
        HT2: 30,
        LT2: 20,
        HT3: 15,
        LT3: 10,
        HT4: 5,
        LT4: 3,
        HT5: 2,
        LT5: 1,
        Unranked: 0
    };
    return values[rank] ?? 0;
}

// =========================
// Selector de rival
// =========================
const changeA = document.getElementById("changeA");
const changeB = document.getElementById("changeB");
const newCompare = document.getElementById("newCompare");

let selectorMode = null; 
let tempNewA = null; // para selector doble

// Cambiar jugador A
changeA.addEventListener("click", () => {
    selectorMode = "A";
    overlay.classList.remove("hidden");
    searchInput.value = "";
    resultsContainer.innerHTML = "";
    searchInput.focus();
});

// Cambiar jugador B
changeB.addEventListener("click", () => {
    selectorMode = "B";
    overlay.classList.remove("hidden");
    searchInput.value = "";
    resultsContainer.innerHTML = "";
    searchInput.focus();
});

// Nueva comparación (selector doble)
newCompare.addEventListener("click", () => {
    selectorMode = "NEW_A";
    tempNewA = null;
    overlay.classList.remove("hidden");
    searchInput.value = "";
    resultsContainer.innerHTML = "";
    searchInput.focus();
});

const overlay = document.getElementById("rivalSelectorOverlay");
const searchInput = document.getElementById("rivalSearchInput");
const resultsContainer = document.getElementById("rivalResults");

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

let playersCache = [];

fetch("tiers_ranking.json")
  .then(res => res.json())
  .then(data => {
    playersCache = data;
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  resultsContainer.innerHTML = "";

  if (!query) return;

  playersCache
    .filter(p =>
        p.nick.toLowerCase().includes(query) &&
        p.id !== id1 // excluir jugador A
    )
    .slice(0, 10)
    .forEach(player => {
      const div = document.createElement("div");
      div.className = "result-item";

      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${
            player.avatar
              ? `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png?size=64`
              : `https://cdn.discordapp.com/embed/avatars/${Number(player.id) % 5}.png`
          }" style="width:32px; height:32px; border-radius:50%;">

          <div>
            <strong>${player.nick}</strong>
            <div style="font-size:12px; color:#aaa;">${player.region}</div>
          </div>
        </div>
      `;

div.addEventListener("click", () => {

    // Cambiar jugador A
    if (selectorMode === "A") {
        window.location.href = `compare.html?id1=${player.id}&id2=${id2}`;
        return;
    }

    // Cambiar jugador B
    if (selectorMode === "B") {
        window.location.href = `compare.html?id1=${id1}&id2=${player.id}`;
        return;
    }

    // Nueva comparación — elegir jugador A
    if (selectorMode === "NEW_A") {
        tempNewA = player.id;
        selectorMode = "NEW_B";
        searchInput.value = "";
        resultsContainer.innerHTML = "";
        searchInput.placeholder = "Elegir jugador B...";
        return;
    }

    // Nueva comparación — elegir jugador B
    if (selectorMode === "NEW_B") {
        window.location.href = `compare.html?id1=${tempNewA}&id2=${player.id}`;
        return;
    }
});

      resultsContainer.appendChild(div);
    });
});

// Cerrar selector con ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    overlay.classList.add("hidden");
  }
});
