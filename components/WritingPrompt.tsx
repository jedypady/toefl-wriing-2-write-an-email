import React from 'react';
import type { WritingPromptContent } from '../types';

interface WritingPromptProps {
    prompt: WritingPromptContent | null;
}

export const WritingPrompt: React.FC<WritingPromptProps> = ({ prompt }) => {

    if (!prompt) {
        return (
             <div className="bg-base-200 rounded-lg border border-base-300 p-6 min-h-[260px] flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 font-semibold">Generating a new scenario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-base-200 rounded-lg border border-base-300 p-6">
            <h2 className="text-xl font-bold mb-2 text-base-content">{prompt.title}</h2>
            <p className="mb-4 text-gray-300">{prompt.scenario}</p>
            <h3 className="font-semibold mb-3 text-base-content">In your email, do the following:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                {prompt.instructions.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p className="text-gray-400">{prompt.footer}</p>
        </div>
    );
};