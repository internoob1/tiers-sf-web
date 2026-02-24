// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const discordId = params.get("id");

if (!discordId) {
    document.getElementById("profileContent").innerHTML = `
        <h2 style="color:#ff5555;">Error: No se proporcionó un ID válido.</h2>
    `;
    throw new Error("No ID provided");
}

// Cargar datos
Promise.all([
    fetch("tiers_players.json").then(r => r.json()),
    fetch("tiers_ranking.json").then(r => r.json())
])
.then(([playersData, rankingData]) => {

    // playersData es un objeto: { "id": { ... } }
    const player = playersData[discordId];
    const rankingInfo = rankingData.find(p => p.id === discordId);

    if (!player || !rankingInfo) {
        document.getElementById("profileContent").innerHTML = `
            <h2 style="color:#ff5555;">Jugador no encontrado.</h2>
        `;
        return;
    }

    // Avatar de Discord (si tenés hash en el futuro, se usa; si no, no rompe)
    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${player.avatar || ""}.png?size=256`;

    // Renderizar perfil
    document.getElementById("profileContent").innerHTML = `
        <div style="display:flex; gap:25px; align-items:center; justify-content:center; flex-wrap:wrap;">

            <!-- Avatar -->
            <div>
                <img src="${avatarUrl}" 
                     onerror="this.style.display='none';"
                     style="width:160px; height:160px; border-radius:12px; box-shadow:0 0 18px rgba(0,170,255,0.4);" />
            </div>

            <!-- Info principal -->
            <div style="text-align:left; max-width:400px;">
                <h2 style="font-family:'Orbitron'; margin:0 0 6px 0; font-size:26px;">
                    ${player.nick}
                </h2>

                <p style="color:#bfc7d5; margin:4px 0;">Región: <b>${player.region}</b></p>
                <p style="color:#bfc7d5; margin:4px 0;">Puntos: <b>${rankingInfo.score}</b></p>
                <p style="color:#bfc7d5; margin:4px 0;">Posición: <b>${rankingInfo.position}</b></p>
            </div>
        </div>

        <hr style="margin:25px auto; width:60%; border-color:#1f2a3a;">

        <!-- Rangos -->
        <h3 style="color:var(--accent); letter-spacing:1px;">RANGOS</h3>

        <div style="display:flex; justify-content:center; gap:20px; margin-top:10px; flex-wrap:wrap;">
            <div class="rank-cell ${player.meleeRank}">${player.meleeRank}</div>
            <div class="rank-cell ${player.weaponsRank}">${player.weaponsRank}</div>
            <div class="rank-cell ${player.mixedRank}">${player.mixedRank}</div>
        </div>

        <hr style="margin:25px auto; width:60%; border-color:#1f2a3a;">

        <!-- Info extra -->
        <p style="color:#bfc7d5;">Tester: <b>${player.testerId || "N/A"}</b></p>
        <p style="color:#bfc7d5;">Último test: <b>${player.lastTestDate || "N/A"}</b></p>

        <button onclick="window.location.href='index.html'"
                style="margin-top:20px; padding:10px 20px; border:none; border-radius:8px;
                       background:linear-gradient(135deg,#0284c7,#00aaff); color:white;
                       font-weight:600; cursor:pointer; box-shadow:0 0 12px rgba(0,170,255,0.4);">
            Volver al ranking
        </button>
    `;

    // Animación suave
    setTimeout(() => {
        document.getElementById("profileContent").style.opacity = 1;
    }, 50);

})
.catch(err => {
    console.error("Error cargando datos:", err);
    document.getElementById("profileContent").innerHTML = `
        <h2 style="color:#ff5555;">Error cargando datos del jugador.</h2>
    `;
});
