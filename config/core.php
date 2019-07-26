<?php
// show error reporting
error_reporting(E_ALL);

// set your default time-zone
date_default_timezone_set('Asia/Jakarta');

// variables used for jwt (registered claim names)
$key = "secretkey12345";
$issuer = "http://angga-ari.org";
$audience = "http://angga-ari.com";
$issuedAt = time();
$expirationTime = time() + (3600 * 24);