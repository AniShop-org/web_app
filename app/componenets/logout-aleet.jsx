import { LogOut } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1A1A1A]/90 w-full max-w-sm mx-auto p-6 rounded-xl border border-[#252525]">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-[#FF33331A]">
                            <LogOut className="h-6 w-6 text-[#FF3333]" />
                        </div>
                    </div>
                    <p className="mb-6">
                        Are you sure you want to log out of your account?                    
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 border border-[#252525] text-white rounded-full hover:bg-[#252525] transition-colors text-sm font-medium"
                        >
                            Log out
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-[#FF3333] text-white rounded-full hover:bg-[#E62E2E] transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;