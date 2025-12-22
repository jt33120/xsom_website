<?php
// Réponse en texte brut
header('Content-Type: text/plain; charset=utf-8');

// Vérifie la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Méthode non autorisée.";
    exit;
}

// ---- CONFIG ----
$destinataire = "jean-philippe.talou@xsom.fr";
$expediteur   = "no-reply@xsom.fr"; // évite From = To
$maxFileSize  = 5 * 1024 * 1024; // 5 Mo
$allowedMime  = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
$allowedExt   = ['pdf','doc','docx'];

// Utilitaire CRLF
function crlf_join(array $lines): string { return implode("\r\n", $lines); }
// Sécurité basique
function field(string $name): string {
    return isset($_POST[$name]) ? trim((string)$_POST[$name]) : '';
}

// ---- RÉCUP CHAMPS ----
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
$subject            = "Nouvelle candidature – {$nom} {$prenom}";
$subject_encoded    = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$profilAffiche      = ($profil !== '' ? $profil : 'Non précisé');

$corps  = "Nouvelle candidature reçue depuis le site xSOM Consulting\n\n";
$corps .= "Nom      : {$nom}\n";
$corps .= "Prénom   : {$prenom}\n";
$corps .= "Email    : {$email}\n";
$corps .= "Profil   : {$profilAffiche}\n\n";
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

    // Vérifie extension
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) {
        http_response_code(400);
        echo "Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX.";
        exit;
    }

    // Détecte MIME
    if (function_exists('mime_content_type')) {
        $detectedType = mime_content_type($fileTmpPath) ?: $fileType;
        $fileType = $detectedType;
    }
    if (!in_array($fileType, $allowedMime, true)) {
        http_response_code(400);
        echo "Type MIME non autorisé.";
        exit;
    }

    $fileData = file_get_contents($fileTmpPath);
    if ($fileData === false) {
        http_response_code(400);
        echo "Impossible de lire le fichier envoyé.";
        exit;
    }
    $fileContent   = chunk_split(base64_encode($fileData));
    $hasAttachment = true;
}

// ---- HEADERS + MIME ----
$boundary = md5(uniqid((string)mt_rand(), true));
$headers   = [];
$headers[] = "From: xSOM Consulting <{$expediteur}>";
$headers[] = "Reply-To: {$prenom} {$nom} <{$email}>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";
$headers_string = crlf_join($headers);

// ---- BODY MIME ----
$bodyParts = [];
$bodyParts[] = "--{$boundary}";
$bodyParts[] = "Content-Type: text/plain; charset=\"utf-8\"";
$bodyParts[] = "Content-Transfer-Encoding: 8bit";
$bodyParts[] = "";
$bodyParts[] = $corps;
$bodyParts[] = "";

if ($hasAttachment) {
    $safeName = str_replace(['"',"\r","\n"], '', $fileName);
    $bodyParts[] = "--{$boundary}";
    $bodyParts[] = "Content-Type: {$fileType}; name=\"{$safeName}\"";
    $bodyParts[] = "Content-Transfer-Encoding: base64";
    $bodyParts[] = "Content-Disposition: attachment; filename=\"{$safeName}\"";
    $bodyParts[] = "";
    $bodyParts[] = $fileContent;
    $bodyParts[] = "";
}

$bodyParts[] = "--{$boundary}--";
$bodyParts[] = "";
$body = crlf_join($bodyParts);

// ---- ENVOI ----
// Envelope sender pour MTA, et sendmail_from pour Windows
$envelopeSender = $expediteur;
@ini_set('sendmail_from', $envelopeSender);
$extraParams = "-f{$envelopeSender}";

if (mail($destinataire, $subject_encoded, $body, $headers_string, $extraParams)) {
    echo "OK";
} else {
    http_response_code(500);
    echo "Une erreur est survenue lors de l’envoi de l’e-mail. Le serveur n’est peut-être pas configuré pour mail().";
}
