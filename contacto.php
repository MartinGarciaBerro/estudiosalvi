<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// ---------- helpers ----------
function respond(bool $ok, string $msg = ''): void {
  // Redirige a una página de gracias (ajusta la ruta si hace falta)
  $url = '/gracias.html?ok=' . ($ok ? '1' : '0');
  if (!$ok && $msg !== '') $url .= '&msg=' . urlencode($msg);
  header('Location: ' . $url);
  exit;
}
function clean(string $v): string { return trim($v); }
function inj(string $s): bool {
  return (bool)preg_match('/[\r\n]|%0A|%0D|Content-Type:|Bcc:|Cc:/i', $s);
}

// ---------- seguridad básica ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Método no permitido');
}

$nombre  = clean($_POST['nombre']  ?? '');
$email   = clean($_POST['email']   ?? '');
$asunto  = clean($_POST['asunto']  ?? '');
$mensaje = clean($_POST['mensaje'] ?? '');
$website = clean($_POST['website'] ?? '');          // honeypot: debe estar vacío
$started = (int)($_POST['started_at'] ?? 0);        // timestamp desde el HTML

if ($website !== '')               respond(false, 'Bot detectado.');
if ($started > 0 && time()-$started < 2) respond(false, 'Envío demasiado rápido.');

if ($nombre === '' || $email === '' || $asunto === '' || $mensaje === '') {
  respond(false, 'Completá todos los campos.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(false, 'Email inválido.');
}
foreach ([$nombre, $email, $asunto] as $v) {
  if (inj($v)) respond(false, 'Entrada inválida.');
}

// ---------- arma el mensaje ----------
$body  = "Nuevo mensaje desde el sitio web\n\n";
$body .= "Nombre:  {$nombre}\n";
$body .= "Email:   {$email}\n";
$body .= "Asunto:  {$asunto}\n\n";
$body .= "Mensaje:\n{$mensaje}\n\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '');

// ---------- envía con PHPMailer + SMTP ----------
try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'smtp.tu-proveedor.com';  // ej: smtp.sendgrid.net
  $mail->SMTPAuth   = true;
  $mail->Username   = 'USUARIO_SMTP';
  $mail->Password   = 'PASSWORD_SMTP';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  $mail->setFrom('no-reply@tudominio.com', 'Formulario Web');
  $mail->addAddress('info@estudiosalvi.com.ar', 'Estudio Salvi');
  $mail->addReplyTo($email, $nombre); // para que puedan responder directo al remitente

  $mail->Subject = 'Contacto web: ' . $asunto;
  $mail->isHTML(false);
  $mail->Body = $body;

  $mail->send();
  respond(true);

} catch (Exception $e) {
  // error_log($e->getMessage());
  respond(false, 'No se pudo enviar el mensaje.');
}