<?php
  include "credentials.php";

  $_POST = json_decode(file_get_contents("php://input"), true);
  $data = $_POST["data"];

  // Validity checks
  if (!is_array($data) || isset($data["_hp"]) || $data["_timer"] < 5000) {
    throw new Exception("Validitätsprüfung nicht überstanden. Bitte versuchen Sie es noch einmal.");
  }
  unset($data["_hp"]);
  unset($data["_timer"]);

  // Set type specific values
  if ($_POST["type"] === "form") {
    $header = "Content-Type: application/x-www-form-urlencoded";
    $content = http_build_query($data);
    $base_url = "https://admin.bayciv.de/wp-json/";
    $path = "contact-form-7/v1/contact-forms/" . $_POST["endpoint"] . "/feedback";
  } else if ($_POST["type"] === "newsletter") {
    $header = "Content-Type: application/json";
    $content = json_encode($data);
    $base_url = "https://api.newsletter2go.com/";
    if ($_POST["endpoint"] === "unsubscribe") {
      $path = "forms/submit/" . $n2g_unsubscribe_key . "?type=unsubscribe";
    } else {
      $path = "forms/submit/" . $n2g_subscribe_key . "?type=subscribe";
    }
  } else {
    throw new Exception("Unbekannter POST-Typ.");
  }
  $url = $base_url . $path;

  // stream_context_create
  $options = array(
		"http" => array(
      "header" => $header . PHP_EOL,
			"method" => "POST",
			"content" => $content
		)
	);
	$context = stream_context_create($options);
	$response = file_get_contents($url, false, $context);

  echo $response;
