<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('salary_local_currency', 10, 2)->nullable()->after('email');
            $table->decimal('salary_euros', 10, 2)->nullable()->after('salary_local_currency');
            $table->decimal('commission', 10, 2)->default(500.00)->after('salary_euros');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['salary_local_currency', 'salary_euros', 'commission']);
        });
    }
};
