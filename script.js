let globalPlayers = [];

// Cargar JSON y renderizar TOP 10
fetch("tiers_ranking.json")
    .then(response => response.json())
    .then(data => {
        globalPlayers = data; // Guardamos todos los jugadores

        // Ordenar por score (mayor a menor)
        data.sort((a, b) => b.score - a.score);

        // Tomar solo el TOP 10
        const top10 = data.slice(0, 10);

        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = "";

        top10.forEach(player => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td data-label="Posición">
                    <span class="cell-box pos-${player.position}">${player.position}</span>
                </td>

                <td data-label="Nick">
                    <span class="cell-box nick-click" data-player='${JSON.stringify(player)}'>
                        ${player.nick}
                    </span>
                </td>

                <td data-label="Región">
                    <span class="cell-box">${player.region}</span>
                </td>

                <td data-label="Score">
                    <span class="cell-box">${player.score}</span>
                </td>

                <td data-label="Melee">
                    <span class="rank-cell ${player.meleeRank}">
                        ${player.meleeRank}
                    </span>
                </td>

                <td data-label="Weapons">
                    <span class="rank-cell ${player.weaponsRank}">
                        ${player.weaponsRank}
                    </span>
                </td>

                <td data-label="Mixed">
                    <span class="rank-cell ${player.mixedRank}">
                        ${player.mixedRank}
                    </span>
                </td>
            `;

            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error cargando ranking:", err);
    });


// --- POPUP DE JUGADOR ---
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("nick-click")) {
        const player = JSON.parse(e.target.getAttribute("data-player"));
        openPlayerModal(player);
    }
});

/* Función para abrir modal */
function openPlayerModal(player) {
    document.getElementById("modalNick").textContent = player.nick;
    document.getElementById("modalRegion").textContent = "Región: " + player.region;
    document.getElementById("modalScore").textContent = "Score: " + player.score;
    document.getElementById("modalPosition").textContent = "Posición: " + player.position;

    const ranksDiv = document.getElementById("modalRanks");
    ranksDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); margin-bottom: 6px; font-weight: 700;">
            <span>Melee</span>
            <span>Weapons</span>
            <span>Mixed</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <span class="rank-cell ${player.meleeRank}">${player.meleeRank}</span>
            <span class="rank-cell ${player.weaponsRank}">${player.weaponsRank}</span>
            <span class="rank-cell ${player.mixedRank}">${player.mixedRank}</span>
        </div>
    `;

    document.getElementById("playerModal").style.display = "block";
}

/* Cerrar popup */
document.querySelector(".close-btn").onclick = function() {
    document.getElementById("playerModal").style.display = "none";
};

window.onclick = function(e) {
    if (e.target === document.getElementById("playerModal")) {
        document.getElementById("playerModal").style.display = "none";
    }
};


// --- BUSCADOR (BOTÓN) ---
document.getElementById("searchBtn").addEventListener("click", function() {
    const input = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("searchResult");

    if (input === "") {
        resultDiv.style.display = "block";
        resultDiv.textContent = "Ingresá un nombre para buscar.";
        return;
    }

    const player = globalPlayers.find(p => p.nick.toLowerCase() === input.toLowerCase());

    if (!player) {
        resultDiv.style.display = "block";
        resultDiv.textContent = "No se encontró al jugador.";
        return;
    }

    resultDiv.style.display = "none";
    openPlayerModal(player);
});


// --- BÚSQUEDA INSTANTÁNEA + AUTOCOMPLETADO ---
const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");

searchInput.addEventListener("input", function () {
    const text = searchInput.value.toLowerCase().trim();

    if (text === "") {
        autocompleteList.classList.remove("show");
        autocompleteList.innerHTML = "";
        return;
    }

    const matches = globalPlayers.filter(p =>
        p.nick.toLowerCase().includes(text)
    );

    if (matches.length === 0) {
        autocompleteList.classList.add("show");
        autocompleteList.innerHTML = `<li>No se encontró</li>`;
        return;
    }

    autocompleteList.classList.add("show");
    autocompleteList.innerHTML = "";

    matches.slice(0, 5).forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.nick;

        li.addEventListener("click", () => {
            autocompleteList.classList.remove("show");
            searchInput.value = player.nick;
            openPlayerModal(player);
        });

        autocompleteList.appendChild(li);
    });
});

// Cerrar autocompletado al hacer clic fuera
document.addEventListener("click", function(e) {
    if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.classList.remove("show");
    }
});

