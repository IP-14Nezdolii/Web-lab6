<?php
$data = file_get_contents('php://input');
$filename = 'data.txt';
file_put_contents($filename, $data);
http_response_code(200);
?>