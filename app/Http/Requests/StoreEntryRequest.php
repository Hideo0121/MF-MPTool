<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntryRequest extends FormRequest
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
            'line_uid' => ['required', 'string', 'max:255'],
            'month' => ['nullable', 'integer', 'between:1,12'],
            'day' => ['nullable', 'integer', 'between:1,31'],
            'hour' => ['nullable', 'integer', 'between:0,23'],
            'minute' => ['nullable', 'integer', 'between:0,59'],
            'ng_reason_id' => ['required', 'exists:ng_reasons,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'line_uid.required' => 'LINE UIDは必須です。',
            'line_uid.max' => 'LINE UIDは255文字以内で入力してください。',
            'month.between' => '月は1-12の範囲で入力してください。',
            'day.between' => '日は1-31の範囲で入力してください。',
            'hour.between' => '時は0-23の範囲で入力してください。',
            'minute.between' => '分は0-59の範囲で入力してください。',
            'ng_reason_id.required' => 'NG理由を選択してください。',
            'ng_reason_id.exists' => '選択されたNG理由が無効です。',
        ];
    }
}
