"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const RatingSlider = ({
    min = 0,
    max = 5,
    step = 1,
    defaultValue = [min, max],
    onChange,
}) => {
    const [values, setValues] = useState(() => {
        // Ensure the default values are clamped within the min and max range
        const clampedDefault = [
            Math.max(min, Math.min(max, defaultValue[0])),
            Math.max(min, Math.min(max, defaultValue[1])),
        ];
        return clampedDefault;
    });

    const [isDragging, setIsDragging] = useState(null);
    const sliderRef = useRef(null);

    const calculatePosition = useCallback(
        (value) => ((value - min) / (max - min)) * 100,
        [min, max]
    );

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        setIsDragging(index);
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (isDragging === null || !sliderRef.current) return;

            const slider = sliderRef.current.getBoundingClientRect();
            const percentage = Math.min(Math.max(0, (e.clientX - slider.left) / slider.width), 1);
            const newValue = Math.round((percentage * (max - min) + min) / step) * step;

            setValues((prev) => {
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
        },
        [isDragging, max, min, step]
    );

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (isDragging !== null) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            onChange?.(values);
        }, 300);
        return () => clearTimeout(debounce);
    }, [values, onChange]);

    return (
        <div ref={sliderRef} className="relative w-full max-w-lg h-20 select-none">
            {/* Track */}
            <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2">
                <div
                    className="absolute h-full bg-[#FF3333] rounded-full"
                    style={{
                        left: `${calculatePosition(values[0])}%`,
                        right: `${100 - calculatePosition(values[1])}%`,
                    }}
                />
            </div>

            {/* Thumbs */}
            {values.map((value, index) => (
                <div
                    key={index}
                    className="absolute top-1/2 w-5 h-5 bg-[#FF3333] rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ left: `${calculatePosition(value)}%` }}
                    onMouseDown={(e) => handleMouseDown(index, e)}
                >

                </div>
            ))}

            {/* Display Values */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-white">
                <span>Min: {values[0].toLocaleString()}</span>
                <span>Max: {values[1].toLocaleString()}</span>
            </div>
        </div>
    );
};

export default RatingSlider;
