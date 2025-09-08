<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
use Closure;

class StoreLineUidEntryRequest extends FormRequest
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
            'line_uid' => 'required|string|size:33|regex:/^[a-zA-Z0-9]+$/',
            'month' => 'nullable|integer|min:1|max:12',
            'day' => 'nullable|integer|min:1|max:31',
            'hour' => 'nullable|integer|min:0|max:23',
            'minute' => 'nullable|integer|min:0|max:59',
            'points' => 'required|integer',
            'ng_reason_id' => 'required|exists:ng_reasons,id',
        ];
    }

    /**
     * Get the "after" validation rules.
     *
     * @return array<string, Closure>
     */
    public function after(): array
    {
        return [
            function ($validator) {
                $month = $this->input('month');
                $day = $this->input('day');
                $hour = $this->input('hour');
                $minute = $this->input('minute');

                // Only proceed if the basic components are there
                if ($month && $day && $hour && $minute) {
                    // Use a try-catch block to handle invalid dates like Feb 30th
                    try {
                        // Create a Carbon instance, initially assuming the current year.
                        $inputDate = Carbon::create(date('Y'), $month, $day, $hour, $minute);

                        // If the resulting date is in the future, it's possible the user
                        // is entering data from the end of the previous year.
                        // Let's subtract a year and see.
                        if ($inputDate->isFuture()) {
                            $inputDate->subYear();
                        }

                        // After our adjustment, if the date is *still* in the future,
                        // then it's an invalid entry. This is a safeguard.
                        if ($inputDate->isFuture()) {
                            $validator->errors()->add(
                                'date',
                                'The entered date and time cannot be in the future.'
                            );
                        }
                    } catch (\Throwable $e) {
                        $validator->errors()->add(
                            'date',
                            'The provided date (e.g., Month, Day) is not valid.'
                        );
                    }
                }
            }
        ];
    }
}
