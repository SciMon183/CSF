<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'csf';
$user = 'csf';
$password = 'csf';

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $user,
        $password
    );

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Insert new sensor data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['temperature']) && isset($data['humidity']) && isset($data['dust_density']) && isset($data['air_quality']) && isset($data['motion_detected'])) {
            $sql = "INSERT INTO sensor_data (temperature, humidity, dust_density, air_quality, motion_detected) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['temperature'],
                $data['humidity'],
                $data['dust_density'],
                $data['air_quality'],
                $data['motion_detected'] ? 1 : 0
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Data inserted successfully',
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Missing required fields: temperature, humidity, dust_density, air_quality, motion_detected'
            ]);
        }
    } else {
        // Get sensor data
        $sql = "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 20";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }

} catch(PDOException $e) {

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}