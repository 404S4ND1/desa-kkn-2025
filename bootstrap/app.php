<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'api/*' // Izinkan akses ke API tanpa CSRF
        ]);

        // Tambahkan konfigurasi CORS manual jika perlu, 
        // tapi Laravel 11 biasanya sudah auto-handle jika header benar.
        // Cara paling pasti di L11 adalah memastikan api/* boleh diakses.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
