let riskChartInstance = null;
let globalLogs = []; // 🔥 store for reuse (search + chart)

// ---------- MAIN FUNCTION ----------
async function loadLogs(){

    try{

        const res1 = await fetch("http://127.0.0.1:5050/logs");
        let normalLogs = await res1.json();

        let sensitiveLogs = [];
        try {
            const res2 = await fetch("http://127.0.0.1:5050/sensitive_logs");
            sensitiveLogs = await res2.json();
        } catch (err) {}

        const formattedNormal = normalLogs.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            event_type: log.event_type || "AI_ACCESS",
            details: log.details || "",
            risk_score: log.risk_score || 0,
            isSensitive: false
        }));

        const formattedSensitive = sensitiveLogs.map(log => ({
            id: log.id + 100000,
            timestamp: log.timestamp,
            event_type: log.detected || "SENSITIVE",
            details: log.content || "",
            risk_score: log.risk_score || 0,
            isSensitive: true,
            detected: log.detected || ""
        }));

        const allLogs = [...formattedNormal, ...formattedSensitive];
        globalLogs = allLogs;

        allLogs.sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp));

        // ---------- LAST 3 HOURS ----------
        const now = new Date();
        const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));

        const recentLogs = allLogs.filter(log =>
            new Date(log.timestamp) >= threeHoursAgo
        );

        // ---------- TOP CARDS ----------
        const totalEvents = recentLogs.length;

        let totalRisk = 0;
        if (recentLogs.length > 0) {
            const sum = recentLogs.reduce((a,b)=> a + b.risk_score, 0);
            const weighted = (sum / recentLogs.length) * Math.log2(recentLogs.length + 1);
            totalRisk = Math.min(Math.round(weighted), 100);
        }

       let riskLevel = "LOW";
let riskColor = "#22c55e"; // green

if (totalRisk >= 76) {
    riskLevel = "CRITICAL";
    riskColor = "#dc2626"; // red
}
else if (totalRisk >= 51) {
    riskLevel = "HIGH";
    riskColor = "#ef4444";
}
else if (totalRisk >= 26) {
    riskLevel = "MEDIUM";
    riskColor = "#facc15"; // yellow
}

const riskEl = document.getElementById("riskLevel");
riskEl.innerText = riskLevel;
riskEl.style.color = riskColor;

        document.getElementById("totalEvents").innerText = totalEvents;
        document.getElementById("totalRisk").innerText = totalRisk + "%";
        document.getElementById("riskLevel").innerText = riskLevel;

        // ---------- LIVE TABLE ----------
        const liveTable = document.getElementById("liveLogs");
        liveTable.innerHTML = "";

        allLogs.slice(0,20).forEach(log=>{
            liveTable.innerHTML += `
<tr ${log.isSensitive ? 'style="background:#2a1a1a;"' : ''}>
<td>➤</td>
<td>${log.timestamp}</td>
<td>${formatDetected(log.event_type)}</td>
<td>${log.details}</td>
<td style="color:${getRiskColor(log.risk_score)}">${log.risk_score}%</td>
</tr>`;
        });

        // ---------- LAST 3 HOURS TABLE ----------
        const recentTable = document.getElementById("recentLogs");
        recentTable.innerHTML = "";

        recentLogs.forEach(log=>{
            recentTable.innerHTML += `
<tr>
<td>➤</td>
<td>${log.timestamp}</td>
<td>${formatDetected(log.event_type)}</td>
<td>${log.details}</td>
<td>${log.risk_score}%</td>
</tr>`;
        });

        // ---------- PIE ----------
        updatePieChart(recentLogs);

    } catch(err){
        console.log(err);
    }
}


// ---------- PIE CHART ----------
function updatePieChart(logs){

    let counts = {};

    logs.forEach(log => {

        // ✅ SENSITIVE
        if (log.isSensitive && log.detected) {

            let types = log.detected.split(",");

            types.forEach(t => {
                const key = t.toUpperCase();
                counts[key] = (counts[key] || 0) + 1;
            });

        }

        // ✅ BLOCKED
        else if (log.event_type === "BLOCKED_ATTEMPT") {
            counts["BLOCKED"] = (counts["BLOCKED"] || 0) + 1;
        }

        // ✅ AI ACCESS
        else if (log.event_type === "AI_ACCESS") {
            counts["AI_ACCESS"] = (counts["AI_ACCESS"] || 0) + 1;
        }

    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const ctx = document.getElementById("riskChart");

    if(!ctx) return;

    if(riskChartInstance){
        riskChartInstance.destroy();
    }

    riskChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        },
        options: {
            onClick: function(evt, elements) {

                if(elements.length > 0){

                    const index = elements[0].index;

                    const label = labels[index];
                    const value = values[index];

                    const total = values.reduce((a,b)=>a+b,0);

                    const percent = ((value / total) * 100).toFixed(1);

                    document.getElementById("chartInfo").innerText =
                        `${label} → ${value} events (${percent}%)`;
                }
            }
        }
    });
}


// ---------- POPUP ----------
function showRiskChart(){
    document.getElementById("riskChartContainer").style.display = "block";
}

function closeRiskChart(){
    document.getElementById("riskChartContainer").style.display = "none";
}


// ---------- SEARCH ----------
function searchLogs(){

    const date = document.getElementById("searchDate").value;
    const hour = document.getElementById("searchHour").value;

    if(!date || hour==="") return;

    const results = globalLogs.filter(log=>{
        const d = new Date(log.timestamp);
        return (
            d.toISOString().slice(0,10) === date &&
            String(d.getHours()).padStart(2,'0') === hour
        );
    });

    const table = document.getElementById("searchResults");
    table.innerHTML = "";

    results.forEach(log=>{
        table.innerHTML += `
<tr>
<td>➤</td>
<td>${log.timestamp}</td>
<td>${formatDetected(log.event_type)}</td>
<td>${log.details}</td>
<td>${log.risk_score}%</td>
</tr>`;
    });
}

function clearSearch(){
    document.getElementById("searchResults").innerHTML = "";
}


// ---------- HELPERS ----------
function getRiskColor(score){
    if(score >= 70) return "red";
    if(score >= 40) return "orange";
    return "green";
}

function formatDetected(text){
    if(!text) return "";
    return text.toUpperCase();
}


// ---------- AUTO ----------
loadLogs();
setInterval(loadLogs, 5000);
