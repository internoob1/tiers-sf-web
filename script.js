fetch("tiers_ranking.json")
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = "";

        data.forEach(player => {
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
});

/* Cerrar popup */
document.querySelector(".close-btn").onclick = function() {
    document.getElementById("playerModal").style.display = "none";
};

window.onclick = function(e) {
    if (e.target === document.getElementById("playerModal")) {
        document.getElementById("playerModal").style.display = "none";
    }
};
