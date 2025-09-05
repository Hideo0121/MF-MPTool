<?php

namespace App\Http\Controllers;

use App\Models\NgReason;
use Illuminate\Http\Request;

class NgReasonController extends Controller
{
    public function index()
    {
        return NgReason::all();
    }
}