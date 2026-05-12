<?php

namespace App\Observers;

use App\Models\Card;

class CardObserver
{
    public function created(Card $card)
    {
        $card->members()->create([
            'user_id' => $card->user_id,
            'role' => 'Owner',
        ]);
    }

    public function deleted(Card $card)
    {
        $card->members()->delete();
    }
}
