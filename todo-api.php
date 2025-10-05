<?php
header('Content-Type: application/json');

// Read current todos in json file
$file = 'todo.json';
if (file_exists($file)) {
    $json_data = file_get_contents($file);
    $todos = json_decode($json_data, true);
} else {
    $todos = [];
}

// Add new entry to json file
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $input = json_decode($data, true);
    
    //add validation
    $todoText = trim($input['todo'] ?? '');
    if ($todoText === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Todo text cannot be empty']);
        exit;
    }

    $todos[] = $input['todo'];
    file_put_contents($file, json_encode($todos));
    echo json_encode(['status' => 'success']);
    exit;
}
 
echo json_encode($todos);