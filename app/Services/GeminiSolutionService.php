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
        $response = Http::timeout(25)
            ->retry(2, 300)
            ->withHeaders(['x-goog-api-key' => (string) config('services.gemini.key')])
            ->post(sprintf(self::ENDPOINT, config('services.gemini.model')), [
                'contents' => [[
                    'parts' => [['text' => $this->prompt($workLog)]],
                ]],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 1200,
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
        the way you would describe it yourself after fixing it.

        Issue title: {$workLog->title}
        Reported details: {$description}

        Write in the first person and past tense, as actions you carried out. For example:
        "I solved this problem by connecting the cable, and the network came back up."

        Open with one short sentence saying what you found and how you fixed it. Then list
        2 to 4 numbered steps you took, each one sentence. Close with the outcome.
        Keep the whole note under 150 words. Use complete sentences with correct
        capitalization and punctuation. Plain text only: no markdown, no bold, no headings.
        PROMPT;
    }

    private function textFrom(Response $response): string
    {
        $parts = data_get($response->json(), 'candidates.0.content.parts', []);

        foreach ((array) $parts as $part) {
            if (empty($part['thought']) && filled($part['text'] ?? null)) {
                return trim($part['text']);
            }
        }

        throw new RuntimeException('The AI service returned an empty response.');
    }
}
