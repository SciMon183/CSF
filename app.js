const API_URL = 'api/sensor.php';

let tempChart;
let airChart;
let methaneChart;

async function loadData() {

    const response = await fetch(API_URL);
    const data = await response.json();

    // Remap API fields to expected format
    const remappedData = data.map(item => ({
        temperature: parseFloat(item.temperature),
        humidity: parseFloat(item.humidity),
        dust: parseFloat(item.dust_density),
        aqi: parseInt(item.air_quality),
        motion: item.motion_detected == 1 || item.motion_detected === true,
        time: new Date(item.timestamp).toLocaleTimeString(),
        timestamp: item.timestamp
    }));

    const latest = remappedData[remappedData.length - 1];

    document.getElementById('motion').innerText = latest.motion ? 'WYKRYTO' : 'BRAK';
    document.getElementById('dust').innerText = latest.dust.toFixed(2) + ' mg/m³';
    document.getElementById('aqi').innerText = latest.aqi + ' VOC';
    document.getElementById('temperature').innerText = latest.temperature.toFixed(1) + ' °C';
    document.getElementById('pressure').innerText = latest.humidity.toFixed(1) + ' %';
    
    updateCharts(remappedData);
}

function updateCharts(data) {

    const labels = data.map(item => item.time);

    const temperatures = data.map(item => item.temperature);
    const air = data.map(item => item.aqi);
    const humidity = data.map(item => item.humidity);
    
    if(tempChart) tempChart.destroy();
    if(airChart) airChart.destroy();
    if(methaneChart) methaneChart.destroy();

    tempChart = new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperatura (°C)',
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
                label: 'Jakość powietrza (VOC Index)',
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
                label: 'Wilgotność (%)',
                data: humidity,
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