<?php
declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------- helpers ----------
function clean(string $v): string { return trim($v); }
function inj(string $s): bool {
  return (bool)preg_match('/[\r\n]|%0A|%0D|Content-Type:|Bcc:|Cc:/i', $s);
}

// ---------- seguridad básica ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  exit('Método no permitido');
}

// ---------- datos ----------
$nombre  = clean($_POST['nombre']  ?? '');
$email   = clean($_POST['email']   ?? '');
$asunto  = clean($_POST['asunto']  ?? '');
$mensaje = clean($_POST['mensaje'] ?? '');
$website = clean($_POST['website'] ?? ''); // honeypot
$started = (int)($_POST['started_at'] ?? 0); // timestamp

// ---------- validaciones básicas ----------
if ($nombre === '' || $email === '' || $asunto === '' || $mensaje === '') {
  exit('Error: Completá todos los campos.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  exit('Error: Email inválido.');
}
foreach ([$nombre, $email, $asunto] as $v) {
  if (inj($v)) exit('Error: Entrada inválida.');
}
// if ($website !== '') exit('Error: Bot detectado.');
// if ($started > 0 && time() - $started < 2) exit('Error: Envío demasiado rápido.');

// ---------- cuerpo ----------
$body  = "Nuevo mensaje desde el sitio web\n\n";
$body .= "Nombre:  {$nombre}\n";
$body .= "Email:   {$email}\n";
$body .= "Asunto:  {$asunto}\n\n";
$body .= "Mensaje:\n{$mensaje}\n\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '');

try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'sandbox.smtp.mailtrap.io';
  $mail->SMTPAuth   = true;
  $mail->Username   = '50f6e39403265e';
  $mail->Password   = '8b3f4b9d8c2c26';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  $mail->setFrom('no-reply@estudiosalvi.com.ar', 'Formulario Web');
  $mail->addAddress('test@mailtrap.io', 'Mailtrap Inbox');
  $mail->addReplyTo($email, $nombre);

  $mail->Subject = 'Contacto web: ' . $asunto;
  $mail->isHTML(false);
  $mail->Body = $body;

  $mail->send();
  echo 'Mensaje enviado correctamente.';

} catch (Exception $e) {
  echo 'Error al enviar el mensaje: ' . $e->getMessage();
}
