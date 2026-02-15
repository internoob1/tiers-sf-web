fetch("tiers_ranking.json")
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#rankingTable tbody");

        data.forEach(player => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${player.position}</td>
                <td>${player.nick}</td>
                <td>${player.region}</td>
                <td>${player.score}</td>
                <td>${player.meleeRank}</td>
                <td>${player.weaponsRank}</td>
                <td>${player.mixedRank}</td>
            `;

            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error cargando ranking:", err);
    });
