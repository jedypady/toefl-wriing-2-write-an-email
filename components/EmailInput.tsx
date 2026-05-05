
// Fix: Create the EmailEditor component which was missing.
import React from 'react';

interface EmailEditorProps {
    emailText: string;
    setEmailText: (text: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    isTimeUp: boolean;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
    emailText,
    setEmailText,
    onSubmit,
    isLoading,
    isTimeUp,
}) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEmailText(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const wordCount = emailText.trim().split(/\s+/).filter(Boolean).length;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
                <textarea
                    value={emailText}
                    onChange={handleTextChange}
                    disabled={isTimeUp || isLoading}
                    placeholder="Write your email here..."
                    className="w-full h-64 p-4 pr-16 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none transition-colors disabled:opacity-50"
                    aria-label="Email input area"
                />
                <div className="absolute bottom-3 right-4 text-sm text-gray-400 pointer-events-none">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </div>
                {isTimeUp && (
                    <div className="absolute inset-0 bg-base-200/80 flex items-center justify-center rounded-lg">
                        <p className="text-lg font-semibold text-red-400">Time's up! Please score your email.</p>
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={isLoading || !emailText.trim()}
                className="w-full px-6 py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Scoring...' : 'Score Email'}
            </button>
        </form>
    );
};
