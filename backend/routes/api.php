<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SalaryController;
use App\Http\Controllers\Api\AuthController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public authentication routes
// Route::post('/register', [AuthController::class, 'register']); // Removed user registration
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-admin', [AuthController::class, 'registerAdmin']);

// Public route for adding/updating salary details
Route::post('/salary', [SalaryController::class, 'storeOrUpdate']);

// Admin routes (now secured with auth:sanctum middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/salaries', [SalaryController::class, 'index']);
    Route::post('/commission', [SalaryController::class, 'updateCommission']);
    Route::post('/user-salary', [SalaryController::class, 'updateUserSalary']);
    Route::delete('/user/{email}', [SalaryController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
}); 