const params = new URLSearchParams(window.location.search);
const id1 = params.get("id1");
const id2 = params.get("id2");

if (!id1 || !id2) {
    document.getElementById("compareContainer").innerHTML =
        "<h2 style='color:#ff5555;'>Faltan jugadores para comparar.</h2>";
    throw new Error("IDs faltantes");
}

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
}

function rankRow(label, rank, rivalRank) {
    const better = rankValue(rank) > rankValue(rivalRank);
    return `
        <div style="margin:6px 0;">
            <span style="color:#bfc7d5;">${label}</span><br>
            <span class="rank-cell ${rank}" style="${better ? `
    box-shadow:
        0 0 12px rgba(0,170,255,0.9),
        0 0 24px rgba(0,170,255,0.7),
        0 0 40px rgba(0,170,255,0.5);
    transform: scale(1.08);
    z-index: 2;
` : ''}">
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

const changeRivalBtn = document.getElementById("changeRivalBtn");

changeRivalBtn.addEventListener("click", () => {
    openRivalSelector();
});

function openRivalSelector() {
    const newRivalId = prompt("Ingresá el ID del nuevo rival:");

    if (!newRivalId) return;

    const params = new URLSearchParams(window.location.search);
    const playerA = params.get("id1");

    if (!playerA) return;

    window.location.href = `/compare?id1=${playerA}&id2=${newRivalId}`;
}


