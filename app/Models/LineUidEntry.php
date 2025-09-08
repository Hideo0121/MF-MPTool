<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LineUidEntry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'line_uid',
        'month',
        'day',
        'hour',
        'minute',
        'points',
        'ng_reason_id',
        'worker_code',
        'is_duplicate',
    ];

    public function ngReason(): BelongsTo
    {
        return $this->belongsTo(NgReason::class);
    }
}
