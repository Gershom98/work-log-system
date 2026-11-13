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
        $response = Http::timeout(30)
            ->withHeaders(['x-goog-api-key' => (string) config('services.gemini.key')])
            ->post(sprintf(self::ENDPOINT, config('services.gemini.model')), [
                'contents' => [[
                    'parts' => [['text' => $this->prompt($workLog)]],
                ]],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 800,
                ],
            ])
            ->throw();

        return $this->textFrom($response);
    }

    private function prompt(WorkLog $workLog): string
    {
        $description = $workLog->description ?: 'No further details were provided.';

        return <<<PROMPT
        You are an experienced operations supervisor helping resolve a reported work issue.

        Issue title: {$workLog->title}
        Details: {$description}

        Propose 3 to 4 practical solutions. Rank them from quickest to most thorough.
        Reply in plain text as a numbered list. For each item give a bold-free one-line heading
        followed by one or two sentences explaining how to apply it. Do not add introductions,
        closing remarks, or markdown.
        PROMPT;
    }

    private function textFrom(Response $response): string
    {
        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('The AI service returned an empty response.');
        }

        return trim($text);
    }
}
