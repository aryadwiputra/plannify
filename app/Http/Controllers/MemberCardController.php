<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\User;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class MemberCardController extends Controller
{
    public function store(Card $card, Request $request): RedirectResponse
    {
        Gate::authorize('member_card', $card);

        $request->validate([
            'email' => ['required', 'email', 'string']
        ]);

        $user = User::query()
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            flashMessage('Unregistered user', 'error');
            return back();
        }

        if ($card->members()->where('user_id', $user->id)->exists()) {
            flashMessage('User is already a member of this card', 'error');
            return back();
        }

        $card->members()->create([
            'user_id' => $user->id,
            'role' => 'Member'
        ]);

        flashMessage('Member successfully invited.');
        return back();
    }

    public function destroy(Card $card, Member $member): RedirectResponse
    {
        Gate::authorize('member_card', $card);
        abort_unless($member->memberable_type === Card::class && (int) $member->memberable_id === (int) $card->id, 404);

        $member->delete();

        flashMessage('Member successfully deleted.');
        return back();
    }
}
