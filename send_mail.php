<?php
// Réponse en texte brut
header('Content-Type: text/plain; charset=utf-8');

// ---- CONFIG ----
$destinataire = "jean-philippe.talou@xsom.fr";
$expediteur   = "jean-philippe.talou@xsom.fr"; // From = To
$maxFileSize  = 5 * 1024 * 1024; // 5 Mo

// ---- RÉCUP CHAMPS ----
function field(string $name): string {
    return isset($_POST[$name]) ? trim((string)$_POST[$name]) : '';
}

$nom     = field('nom');
$prenom  = field('prenom');
$email   = field('email');
$profil  = field('profil');
$message = field('message');

// ---- VALIDATION ----
if ($nom === '' || $prenom === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo "Merci de remplir tous les champs obligatoires.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "L’adresse e-mail saisie n’est pas valide.";
    exit;
}

// ---- CORPS TEXTE ----
$subject = "Nouvelle candidature – {$nom} {$prenom}";

$corps  = "Nouvelle candidature reçue depuis le site xSOM Consulting\n\n";
$corps .= "Nom      : {$nom}\n";
$corps .= "Prénom   : {$prenom}\n";
$corps .= "Email    : {$email}\n";
$corps .= "Profil   : " . ($profil !== '' ? $profil : 'Non précisé') . "\n\n";
$corps .= "Projet / attentes :\n{$message}\n";

// ---- GESTION CV ----
$hasAttachment = false;
$fileContent   = '';
$fileName      = '';
$fileType      = 'application/octet-stream';

if (isset($_FILES['cv']) && $_FILES['cv']['error'] !== UPLOAD_ERR_NO_FILE) {
    $fileError = $_FILES['cv']['error'];

    if ($fileError !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo "Erreur lors de l’upload du CV (code {$fileError}).";
        exit;
    }

    $fileSize = (int)$_FILES['cv']['size'];
    if ($fileSize > $maxFileSize) {
        http_response_code(400);
        echo "Le fichier est trop volumineux (max 5 Mo).";
        exit;
    }

    $fileTmpPath = $_FILES['cv']['tmp_name'];
    $fileName    = basename((string)$_FILES['cv']['name']);

    if (function_exists('mime_content_type')) {
        $detectedType = mime_content_type($fileTmpPath);
        if ($detectedType !== false) {
            $fileType = $detectedType;
        }
    }

    $fileData    = file_get_contents($fileTmpPath);
    if ($fileData !== false) {
        $fileContent   = chunk_split(base64_encode($fileData));
        $hasAttachment = true;
    }
}

// ---- HEADERS + MIME ----
$boundary = md5(uniqid((string)mt_rand(), true));

$headers   = [];
$headers[] = "From: xSOM Consulting <{$expediteur}>";
$headers[] = "Reply-To: {$prenom} {$nom} <{$email}>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";

$headers_string = implode("\r\n", $headers);

// ---- BODY MIME ----
$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $corps . "\r\n\r\n";

if ($hasAttachment) {
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: {$fileType}; name=\"{$fileName}\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n\r\n";
    $body .= $fileContent . "\r\n\r\n";
}

$body .= "--{$boundary}--";

// ---- ENVOI ----
if (mail($destinataire, $subject, $body, $headers_string)) {
    echo "OK";
} else {
    http_response_code(500);
    echo "Une erreur est survenue lors de l’envoi de l’e-mail.";
}
