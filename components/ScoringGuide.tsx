
import React from 'react';
import { SCORING_GUIDE_CONTENT } from '../constants';

export const ScoringGuide: React.FC = () => {
    return (
        <div className="bg-base-200 rounded-lg border border-base-300">
            <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="font-semibold text-base-content">View Scoring Guide</span>
                    <span className="transition-transform duration-300 transform group-open:rotate-180">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </span>
                </summary>
                <div className="p-4 border-t border-base-300">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {SCORING_GUIDE_CONTENT}
                    </pre>
                </div>
            </details>
        </div>
    );
};
