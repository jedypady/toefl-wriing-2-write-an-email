
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 border-b border-base-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                         <div className="p-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-base-content">
                            Email Scoring Assistant
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
