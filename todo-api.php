<?php
header('Content-Type: application/json');

$file = 'todo.json';

// Read existing todos
if (file_exists($file)) {
    $json_data = file_get_contents($file);
    $todos = json_decode($json_data, true);
} else {
    $todos = [];
}

// Detect request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Return all todos
        echo json_encode($todos);
        break;

    case 'POST':
        // Add new todo
        $data = file_get_contents('php://input');
        $input = json_decode($data, true);

        $todoText = trim($input['todo'] ?? '');
        if ($todoText === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Todo text cannot be empty']);
            break;
        }

        // Create a todo with a unique ID
        $newTodo = [
            'id' => uniqid(),   // generates unique string ID
            'text' => $todoText
        ];

        $todos[] = $newTodo;
        file_put_contents($file, json_encode($todos));
        echo json_encode(['status' => 'success', 'todo' => $newTodo]);
        break;

    case 'DELETE':
        // Delete todo by ID
        $data = json_decode(file_get_contents('php://input'), true);
        $idToDelete = $data['id'] ?? null;

        if ($idToDelete === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing todo ID']);
            break;
        }

        $initialCount = count($todos);
        $todos = array_values(array_filter($todos, function($todo) use ($idToDelete) {
            return $todo['id'] !== $idToDelete;
        }));

        if (count($todos) === $initialCount) {
            http_response_code(404);
            echo json_encode(['error' => 'Todo not found']);
            break;
        }

        file_put_contents($file, json_encode($todos));
        echo json_encode(['status' => 'success', 'deletedId' => $idToDelete]);
        break;

    case 'PUT':
        // Placeholder for future updates
        http_response_code(501); // 501 = Not Implemented
        echo json_encode(['error' => 'PUT method not yet implemented']);
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Unsupported request method']);
        break;
}
