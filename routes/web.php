<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', DashboardController::class);
Route::post('/stacking/upload', [DashboardController::class, 'store'])->name('stacking.upload');
Route::delete('/stacking/photo', [DashboardController::class, 'destroy'])->name('stacking.destroy');
