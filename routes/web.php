<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\MyTaskController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\MemberCardController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Workspace
    Route::prefix('workspaces')->controller(WorkspaceController::class)->name('workspaces.')->group(function () {
        Route::get('create', 'create')->name('create');
        Route::post('create', action: 'store')->name('store');
        Route::get('p/{workspace:slug}', 'show')->name('show');
        Route::get('edit/{workspace:slug}', 'edit')->name('edit');
        Route::put('edit/{workspace:slug}', 'update')->name('update');
        Route::delete('destroy/{workspace:slug}', 'destroy')->name('destroy');

        Route::prefix('member')->name('member.')->group(function () {
            Route::post('{workspace:slug}/store', 'member_store')->name('store');
            Route::delete('{workspace}/destroy/{member}', 'member_destroy')->name('destroy');
        });
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Card
    Route::prefix('cards/{workspace:slug}')->controller(CardController::class)->name('cards.')->group(function () {
        Route::get('create', 'create')->name('create');
        Route::post('create', 'store')->name('store');
        Route::get('detail/{card}', 'show')->name('show');
        Route::get('edit/{card}', 'edit')->name('edit');
        Route::put('edit/{card}', 'update')->name('update');
        Route::post('{card}/reorder', 'reorder')->name('reorder');
        Route::delete('destroy/{card}', 'destroy')->name('destroy');
    });

    // Member Card
    Route::prefix('cards/member')->controller(MemberCardController::class)->name('member_card.')->group(function () {
        Route::post('{card}/create', 'store')->name('store');
        Route::delete('{card}/destroy/{member}', 'destroy')->name('destroy');
    });

    // Attachment
    Route::prefix('cards/attachment')->controller(AttachmentController::class)->name('attachments.')->group(function () {
        Route::post('{card}/create', 'store')->name('store');
        Route::delete('{card}/destroy/{attachment}', 'destroy')->name('destroy');
    });

    // Task
    Route::prefix('cards/tasks')->controller(TaskController::class)->name('tasks.')->group(function () {
        Route::post('{card}/create', 'store')->name('store');
        Route::delete('{card}/destroy/{task}', 'destroy')->name('destroy');

        Route::post('{card}/{task}/item', 'item')->name('item');
        Route::put('{card}/{task}/completed', 'completed')->name('completed');
    });

    // My Task
    Route::get('my-tasks', MyTaskController::class)->name('mytasks.index');

    // Users
    Route::prefix('users')->controller(UserController::class)->name('users.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{user}', 'edit')->name('edit');
        Route::put('edit/{user}', 'update')->name('update');
        Route::delete('destroy/{user}', 'destroy')->name('destroy');
    })->middleware('role:admin');
});

require __DIR__ . '/auth.php';
