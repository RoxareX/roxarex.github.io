<?php


$route = explode("?", $_SERVER["REQUEST_URI"])[0];
$method = strtolower($_SERVER["REQUEST_METHOD"]);

switch($route) {
  case "/":
    require_once __DIR__ . "/index.html";
  break;

  case "/calculate":
    require_once __DIR__ . "/calculate/calculate.html";
  break;

  case "/kauppa":
    require_once __DIR__ . "/fanikauppa/dist/index.html";
  break;

  default:
    echo "404";
}

?>


