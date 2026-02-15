fetch("tiers_ranking.json")
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = "";

        data.forEach(player => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td data-label="Posición">${player.position}</td>
                <td data-label="Nick">${player.nick}</td>
                <td data-label="Región">${player.region}</td>
                <td data-label="Score">${player.score}</td>

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
