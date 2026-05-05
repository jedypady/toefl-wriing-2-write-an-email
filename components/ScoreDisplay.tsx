import React from 'react';
import type { ScoreResult } from '../types';
import { LoaderIcon } from './icons/LoaderIcon';

interface ScoreDisplayProps {
    isLoading: boolean;
    scoreResult: ScoreResult | null;
    error: string | null;
    onReset: () => void;
    onRewrite: () => void;
}

const scoreColorMap: { [key: number]: string } = {
    0: 'bg-red-700',
    1: 'bg-red-600',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-emerald-500',
};

const scoreTextColorMap: { [key: number]: string } = {
    0: 'text-red-200',
    1: 'text-red-200',
    2: 'text-orange-200',
    3: 'text-yellow-200',
    4: 'text-green-200',
    5: 'text-emerald-200',
}

const InitialState: React.FC = () => (
    <div className="text-center text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold">Ready to score</h3>
        <p className="mt-1 text-sm">Paste an email on the left and click "Score Email" to see the AI evaluation.</p>
    </div>
);


export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ isLoading, scoreResult, error, onReset, onRewrite }) => {
    return (
        <div className="bg-base-200 rounded-lg border border-base-300 p-6 min-h-[300px] flex flex-col justify-center transition-all duration-300">
            {isLoading && (
                 <div className="text-center">
                    <LoaderIcon className="w-12 h-12 text-brand-primary animate-spin mx-auto" />
                    <p className="mt-4 font-semibold text-lg">Evaluating email...</p>
                    <p className="text-gray-400">The AI is analyzing the text against the rubric.</p>
                </div>
            )}
            {error && (
                <div className="text-center text-red-400">
                     <div className="w-16 h-16 mx-auto mb-4 bg-red-900/50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-lg">An Error Occurred</h3>
                    <p className="mt-1">{error}</p>
                     <div className="mt-6">
                        <button
                            onClick={onReset}
                            className="w-full sm:w-auto px-6 py-2 font-semibold text-base-content bg-base-300 rounded-lg hover:bg-base-300/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
            {!isLoading && !error && !scoreResult && <InitialState />}
            {scoreResult && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="text-center">
                        <p className={`font-bold uppercase tracking-wider text-sm ${scoreTextColorMap[scoreResult.score] || 'text-gray-400'}`}>Score</p>
                        <div className={`mx-auto mt-2 w-24 h-24 rounded-full flex items-center justify-center ${scoreColorMap[scoreResult.score] || 'bg-gray-600'}`}>
                            <span className="text-5xl font-bold text-white">{scoreResult.score}</span>
                            <span className="text-2xl font-semibold text-white/70">/5</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-base-content mb-2">Evaluation</h3>
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                           <p>{scoreResult.explanation.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
                        </div>
                    </div>
                     <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onRewrite}
                            className="w-full px-6 py-2 font-semibold text-base-content bg-base-300 rounded-lg hover:bg-base-300/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-colors"
                        >
                            Rewrite Email
                        </button>
                        <button
                            onClick={onReset}
                            className="w-full px-6 py-2 font-semibold text-white bg-brand-secondary rounded-lg hover:bg-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-colors"
                        >
                            New Scenario
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};