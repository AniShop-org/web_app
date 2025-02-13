import React from 'react';

const Alert = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1A1A1A]/90 md:w-80 w-60 max-w-md mx-auto p-6 rounded-xl border border-[#252525]">
                <div className="text-center">
                    <p className="text-white text-lg">{message}</p>
                    <button
                        onClick={onClose}
                        className="mt-6 px-8 py-2.5 bg-[#FF3333] text-white rounded-full hover:bg-[#E62E2E] transition-colors text-sm font-medium"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;