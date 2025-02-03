"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#FFFFFF1A]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-left text-white text-lg"
            >
                <span>{question}</span>
                <ChevronRight
                    className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    size={20}
                />
            </button>
            {isOpen && (
                <div className="pb-4 text-[#8A8A8A]">
                    {answer}
                </div>
            )}
        </div>
    );
};