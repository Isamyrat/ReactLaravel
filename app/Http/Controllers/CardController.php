<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class CardController extends Controller
{

    public function index(): JsonResponse
    {
        return response()->json(Card::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'card_number' => 'required|digits:16',
            'expiry_month' => 'required|integer|min:1|max:12',
            'expiry_year' => 'required|digits:4|integer|gte:' . date('Y'),
            'cvv' => 'required|digits:3'
        ]);

        $card = Card::create($validated);
        return response()->json($card, 201);
    }

}
