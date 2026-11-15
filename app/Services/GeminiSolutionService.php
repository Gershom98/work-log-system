<?php

namespace App\Services;

use App\Models\WorkLog;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiSolutionService
{
    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    public function generate(WorkLog $workLog): string
    {
        $key = trim((string) config('services.gemini.key'));
        $model = trim((string) config('services.gemini.model')) ?: 'gemini-3.6-flash';

        $response = Http::timeout(25)
            ->retry(2, 300)
            ->withHeaders(['x-goog-api-key' => $key])
            ->post(sprintf(self::ENDPOINT, $model), [
                'contents' => [[
                    'parts' => [['text' => $this->prompt($workLog)]],
                ]],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => 400,
                    'thinkingConfig' => ['thinkingBudget' => 0],
                ],
            ])
            ->throw();

        return $this->textFrom($response);
    }

    private function prompt(WorkLog $workLog): string
    {
        $description = $workLog->description ?: 'No further details were provided.';

        return <<<PROMPT
        You are the supervisor who handled this work issue. Write the resolution note
        you would record in the work log after fixing it.

        Issue title: {$workLog->title}
        Reported details: {$description}

        Write exactly ONE short paragraph, in the first person and past tense, as
        actions you carried out. It must still contain the essential facts: what the
        problem was, what you did to fix it, and the final outcome. Aim for 50 to 70
        words and never exceed 85 words.

        Do not use lists, numbered steps, bullet points, headings or line breaks.
        Plain text only: no markdown, no bold, no quotes around the paragraph. Use
        complete sentences with correct capitalization and punctuation.
        PROMPT;
    }

    private function textFrom(Response $response): string
    {
        $parts = data_get($response->json(), 'candidates.0.content.parts', []);

        foreach ((array) $parts as $part) {
            if (empty($part['thought']) && filled($part['text'] ?? null)) {
                // Keep the note a single paragraph even if the model adds line breaks.
                return trim(preg_replace('/\s+/u', ' ', trim($part['text'])));
            }
        }

        throw new RuntimeException('The AI service returned an empty response.');
    }
}
