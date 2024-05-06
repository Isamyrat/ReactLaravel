<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\ListTasksRequest;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class CardController extends Controller
{

    public function index(): JsonResponse
    {
        logger('CardController@index');
        return response()->json(Card::all());
    }

    public function store(Request $request): JsonResponse
    {
        logger('CardController@store');

        $validated = $request->validate([
            'card_number' => 'required|digits:16',
            'expiry_date' => 'required|date|after:today',
            'cvv' => 'required|digits:3'
        ]);

        $card = Card::create($validated);
        return response()->json($card, 201);
    }
}
