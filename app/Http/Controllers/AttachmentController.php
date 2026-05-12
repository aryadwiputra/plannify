<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Traits\HasFile;
use App\Models\Attachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\AttachmentRequest;

class AttachmentController extends Controller
{
    use HasFile;

    public function store(Card $card, AttachmentRequest $request): RedirectResponse
    {
        Gate::authorize('task_card', $card);

        $request->user()->attachments()->create([
            'card_id' => $card->id,
            'file' => $this->upload_file($request, 'file', 'attachments'),
            'link' => $request->link,
            'name' => $request->name,
        ]);

        flashMessage('Attachment was saved successfully');
        return back();
    }

    public function destroy(Card $card, Attachment $attachment): RedirectResponse
    {
        Gate::authorize('task_card', $card);
        abort_unless($attachment->card_id === $card->id, 404);

        $this->delete_file($attachment, 'file');

        $attachment->delete();

        flashMessage('The attachment was successfully deleted.');
        return back();
    }
}
