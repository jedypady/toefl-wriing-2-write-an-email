import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ScoringGuide } from './components/ScoringGuide';
import { EmailEditor } from './components/EmailInput';
import { ScoreDisplay } from './components/ScoreDisplay';
import { scoreEmail, generateWritingPrompt } from './services/geminiService';
import type { ScoreResult, WritingPromptContent } from './types';
import { SCORING_GUIDE_CONTENT } from './constants';
import { WritingPrompt } from './components/WritingPrompt';
import { Timer } from './components/Timer';
import { LoaderIcon } from './components/icons/LoaderIcon';

const App: React.FC = () => {
    const [writingPrompt, setWritingPrompt] = useState<WritingPromptContent | null>(null);
    const [isPromptLoading, setIsPromptLoading] = useState<boolean>(true);
    const [isRewriteMode, setIsRewriteMode] = useState<boolean>(false);
    
    const [emailText, setEmailText] = useState<string>('');
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [timerKey, setTimerKey] = useState<number>(Date.now());

    const fetchNewPrompt = useCallback(async () => {
        setIsPromptLoading(true);
        setError(null);
        try {
            const prompt = await generateWritingPrompt();
            setWritingPrompt(prompt);
        } catch (err) {
            console.error(err);
            setError('Failed to load a new writing prompt. Please refresh the page.');
        } finally {
            setIsPromptLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewPrompt();
    }, [fetchNewPrompt]);

    const handleScoreEmail = async () => {
        if (!emailText.trim()) {
            setError('Please enter the email text before scoring.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setScoreResult(null);

        try {
            const result = await scoreEmail(emailText, SCORING_GUIDE_CONTENT);
            setScoreResult(result);
        } catch (err) {
            console.error(err);
            setError('An error occurred while scoring the email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeUp = useCallback(() => {
        setIsTimeUp(true);
    }, []);

    const handleReset = () => {
        setEmailText('');
        setScoreResult(null);
        setIsLoading(false);
        setError(null);
        setIsTimeUp(false);
        setIsRewriteMode(false);
        setTimerKey(Date.now());
        fetchNewPrompt();
    };

    const handleRewrite = () => {
        setScoreResult(null);
        setError(null);
        setIsLoading(false);
        setIsTimeUp(false);
        setIsRewriteMode(true);
    };

    const showScoreView = isLoading || !!scoreResult || (!!error && !isPromptLoading);

    if (isPromptLoading && !writingPrompt) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center">
                <LoaderIcon className="w-16 h-16 text-brand-primary animate-spin" />
                <p className="mt-4 text-lg font-semibold">Preparing your writing exercise...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                        <WritingPrompt prompt={writingPrompt} />
                        <ScoringGuide />
                    </div>
                    <div className="flex flex-col gap-6 self-start">
                        {showScoreView ? (
                            <ScoreDisplay
                                isLoading={isLoading}
                                scoreResult={scoreResult}
                                error={error}
                                onReset={handleReset}
                                onRewrite={handleRewrite}
                            />
                        ) : (
                            <>
                                {!isRewriteMode && <Timer key={timerKey} onTimeUp={handleTimeUp} />}
                                <EmailEditor
                                    emailText={emailText}
                                    setEmailText={setEmailText}
                                    onSubmit={handleScoreEmail}
                                    isLoading={isLoading}
                                    isTimeUp={isTimeUp && !isRewriteMode}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;