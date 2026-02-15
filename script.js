fetch("tiers_ranking.json")
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = "";

        data.forEach(player => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td data-label="Posición">
                    <span class="cell-box">${player.position}</span>
                </td>

                <td data-label="Nick">
                    <span class="cell-box">${player.nick}</span>
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
