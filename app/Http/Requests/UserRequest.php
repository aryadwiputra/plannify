<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'username' => [
                'required',
                'min:3',
                'max:255',
                'alpha_dash:ascii',
                Rule::unique('users')->ignore($this->user)
            ],
            'email' => [
                'required',
                'max:255',
                'email',
                Rule::unique('users')->ignore($this->user)
            ],
            'password' => [
                Rule::when($this->routeIs('users.store'), [
                    'required',
                    'min:8',
                    'max:255',
                    'confirmed'
                ]),
                Rule::when($this->routeIs('users.update'), [
                    'nullable',
                    'min:8',
                    'max:255',
                    'confirmed'
                ]),
            ],
            'avatar' => [
                'nullable',
                'mimes:png,jpg',
                'max:2048'
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Name',
            'username' => 'Username',
            'email' => 'Email',
            'password' => 'Password',
            'avatar' => 'Avatar'
        ];
    }
}
