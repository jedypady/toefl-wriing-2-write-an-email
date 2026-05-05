import React, { useState, useEffect, useRef } from 'react';
import { ClockIcon } from './icons/ClockIcon';

interface TimerProps {
    initialMinutes?: number;
    onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes = 7, onTimeUp }) => {
    const [seconds, setSeconds] = useState(initialMinutes * 60);
    const callbackRef = useRef(onTimeUp);

    useEffect(() => {
        callbackRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        if (seconds <= 0) {
            callbackRef.current();
            return;
        }

        const interval = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const isTimeUp = seconds <= 0;
    const isLowTime = seconds <= 60 && !isTimeUp;

    return (
        <div className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${isLowTime ? 'bg-red-900/50 border-red-700' : 'bg-base-200 border-base-300'}`}>
            <ClockIcon className={`w-6 h-6 mr-3 ${isLowTime ? 'text-red-300' : 'text-brand-light'}`} />
            <span className={`text-xl font-bold tracking-wider tabular-nums ${isLowTime ? 'text-red-200 animate-pulse' : 'text-base-content'}`}>
                {isTimeUp ? 'Time Up!' : formatTime()}
            </span>
        </div>
    );
};