<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class SalaryController extends Controller
{
    /**
     * Handle the submission and update of user salary details.
     */
    public function storeOrUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'salary_local_currency' => 'required|numeric|min:0',
            'salary_euros' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if ($user) {
            // Update existing record
            $user->name = $request->input('name');
            $user->salary_local_currency = $request->input('salary_local_currency');
            $user->salary_euros = $request->input('salary_euros');
            $user->save();
            return response()->json(['message' => 'User salary details updated successfully.', 'user' => $user], 200);
        } else {
            // Create new record
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $email,
                'password' => Hash::make(Str::random(10)), // Generate and hash a random password for new users
                'salary_local_currency' => $request->input('salary_local_currency'),
                'salary_euros' => $request->input('salary_euros'),
                // 'commission' will default to 500.00 as per migration
            ]);
            return response()->json(['message' => 'New user salary details added successfully.', 'user' => $user], 201);
        }
    }

    /**
     * Display a listing of all user salary details for admin.
     */
    public function index()
    {
        Gate::authorize('admin-access');

        $users = User::all()->map(function ($user) {
            $user->displayed_salary = $user->salary_euros + $user->commission;
            return $user;
        });

        return response()->json(['salaries' => $users], 200);
    }

    /**
     * Update the commission amount for a specific user.
     */
    public function updateCommission(Request $request)
    {
        Gate::authorize('admin-access');

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
            'commission' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->input('email'))->first();

        $user->commission = $request->input('commission');
        $user->save();

        return response()->json(['message' => 'Commission updated successfully for user ' . $user->name, 'user' => $user], 200);
    }

    /**
     * Update a user's salary details (local currency and euros).
     */
    public function updateUserSalary(Request $request)
    {
        Gate::authorize('admin-access');

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
            'salary_local_currency' => 'required|numeric|min:0',
            'salary_euros' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->input('email'))->first();

        $user->salary_local_currency = $request->input('salary_local_currency');
        $user->salary_euros = $request->input('salary_euros');
        $user->save();

        return response()->json(['message' => 'User salary details updated successfully.', 'user' => $user], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $email)
    {
        Gate::authorize('admin-access');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
