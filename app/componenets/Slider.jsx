"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';

const Slider = ({
    min = 0,
    max = 100,
    step = 1,
    defaultValue = [0, 100],
    onChange
}) => {
    const [values, setValues] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(null);
    const sliderRef = useRef(null);

    const calculatePosition = useCallback((value) => {
        return ((value - min) / (max - min)) * 100;
    }, [min, max]);

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        setIsDragging(index);
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging === null || !sliderRef.current) return;

        const slider = sliderRef.current.getBoundingClientRect();
        const percentage = Math.min(Math.max(0, (e.clientX - slider.left) / slider.width), 1);
        const newValue = Math.round((percentage * (max - min) + min) / step) * step;

        setValues(prev => {
            const newValues = [...prev];
            newValues[isDragging] = newValue;

            // Ensure left thumb doesn't cross right thumb and vice versa
            if (isDragging === 0 && newValue <= prev[1]) {
                return [newValue, prev[1]];
            } else if (isDragging === 1 && newValue >= prev[0]) {
                return [prev[0], newValue];
            }
            return prev;
        });
    }, [isDragging, max, min, step]);

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (isDragging !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    useEffect(() => {
        onChange?.(values);
    }, [values, onChange]);

    return (
        <div
            ref={sliderRef}
            className="relative w-full h-12 select-none"
        >
            <div className="absolute top-1/2 w-full h-1 bg-gray-700 rounded-full transform -translate-y-1/2">
                <div
                    className="absolute h-full bg-red-500 rounded-full"
                    style={{
                        left: `${calculatePosition(values[0])}%`,
                        right: `${100 - calculatePosition(values[1])}%`
                    }}
                />
            </div>

            {values.map((value, index) => (
                <div
                    key={index}
                    className="absolute top-1/2 w-4 h-4 bg-red-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ left: `${calculatePosition(value)}%` }}
                    onMouseDown={(e) => handleMouseDown(index, e)}
                >
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white">
                        ₹{value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Slider;