<?php

use App\Http\Controllers\CardController;
use App\Http\Controllers\DocumentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/cards', [CardController::class, 'index']);
Route::post('/cards', [CardController::class, 'store']);
