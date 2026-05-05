export interface ScoreResult {
    score: number;
    explanation: string;
}

export interface WritingPromptContent {
    title: string;
    scenario: string;
    instructions: string[];
    footer: string;
}
