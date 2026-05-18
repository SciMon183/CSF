const API_URL = 'api/sensors.php';

let tempChart;
let airChart;
let methaneChart;

async function loadData() {

    const response = await fetch(API_URL);
    const data = await response.json();

    const latest = data[data.length - 1];

    document.getElementById('motion').innerText = latest.motion ? 'WYKRYTO' : 'BRAK';
    document.getElementById('dust').innerText = latest.dust + ' µg/m³';
    document.getElementById('aqi').innerText = latest.aqi + ' AQI';
    document.getElementById('temperature').innerText = latest.temperature + ' °C';
    document.getElementById('pressure').innerText = latest.pressure + ' hPa';
    document.getElementById('methane').innerText = latest.methane + ' ppm';

    updateCharts(data);
}

function updateCharts(data) {

    const labels = data.map(item => item.time);

    const temperatures = data.map(item => item.temperature);
    const air = data.map(item => item.aqi);
    const methane = data.map(item => item.methane);
    if(tempChart) tempChart.destroy();
    if(airChart) airChart.destroy();
    if(methaneChart) methaneChart.destroy();

    tempChart = new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperatura',
                data: temperatures,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220,38,38,0.1)',
                fill: true,
                tension: 0.4
            }]
        }
    });

    airChart = new Chart(document.getElementById('airChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'AQI',
                data: air,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22,163,74,0.1)',
                fill: true,
                tension: 0.4
            }]
        }
    });

    methaneChart = new Chart(document.getElementById('methaneChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Metan',
                data: methane,
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15,118,110,0.1)',
                fill: true,
                tension: 0.4
            }]
        }
    });
}

loadData();
setInterval(loadData, 5000);