<?php

namespace App\Http\Requests;

use App\Enums\CardStatus;
use App\Enums\CardPriority;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class CardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'max:255', 'string'],
            'description' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date'],
            'status' => ['required', new Enum(CardStatus::class)],
            'priority' => ['required', new Enum(CardPriority::class)]
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Title',
            'description' => 'Description',
            'deadline' => 'Deadline',
            'status' => 'Status',
            'priority' => 'Priority'
        ];
    }
}
