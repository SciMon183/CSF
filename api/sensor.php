<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'sensors_db';
$user = 'root';
$password = '';

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $user,
        $password
    );

    $sql = "SELECT * FROM sensor_data ORDER BY id ASC LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch(PDOException $e) {

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}