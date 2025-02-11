export const AddressCard = ({ address, isSelected, onSelect, onRemove, onEdit, isSelecting, isDeleting }) => (
    <div className={`bg-neutral-900/50 rounded-3xl sm:p-6 p-2 mb-2 border border-[#252525] ${isSelecting ? 'opacity-50' : ''}`}>
        <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => !isSelecting && !isDeleting && onSelect(address.id)}
        >
            <input
                type="radio"
                checked={isSelected}
                className="mt-2 h-4 w-4 accent-green-500 focus:ring-0 cursor-pointer"
                readOnly
                disabled={isSelecting || isDeleting}
            />
            <div className="flex-grow pl-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-white text-base font-bold sm:pb-2">{address.name}</h3>
                    <span className="px-3 py-1 bg-white text-black rounded-full text-xs">
                        {address.addressType}
                    </span>
                </div>
                <p className="text-[#D9D9D9] text-sm mt-1 leading-relaxed">
                    {address.mobile}<br />
                    {address.address}, {address.locality}<br />
                    {address.district}<br />
                    {address.city} - {address.pincode}
                </p>
            </div>
        </div>
        <div className="flex justify-end space-x-4 text-sm">
            <button
                onClick={() => {
                    if (window.confirm('Are you sure you want to remove this address?')) {
                        onRemove(address.id);
                    }
                }}
                disabled={isSelecting || isDeleting}
                className={`text-neutral-400 hover:text-white transition-colors ${(isSelecting || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isDeleting ? 'Removing...' : 'Remove'}
            </button>
            <button
                onClick={() => onEdit(address)}
                disabled={isSelecting || isDeleting}
                className={`text-white ${(isSelecting || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Edit
            </button>
        </div>
    </div>
);