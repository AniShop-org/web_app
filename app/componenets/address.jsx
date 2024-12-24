"use client";

const AddressCard = ({ name, address, type, isSelected }) => {
    return (
        <div className="flex items-start justify-between p-4 border-b border-gray-700">
            <div className="flex items-start">
                <input
                    type="radio"
                    name="selectedAddress"
                    checked={isSelected}
                    className="mt-1 text-green-500 focus:ring-0"
                    readOnly
                />
                <div className="ml-3">
                    <h3 className="font-semibold text-white">{name}</h3>
                    <p className="text-sm text-gray-400">{address}</p>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    className={`px-3 py-1 text-sm font-medium rounded-md ${type === "Home"
                            ? "bg-green-700 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                >
                    {type}
                </button>
                <div className="ml-4 flex space-x-4">
                    <button
                        className="text-sm font-medium text-gray-300 hover:text-white"
                        onClick={() => alert(`Edit address ${address.id}`)}
                    >
                        Edit
                    </button>
                    <button
                        className="text-sm font-medium text-red-500 hover:text-red-400"
                        onClick={() => alert(`Remove address ${address.id}`)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyAddresses = () => {
    const addresses = [
        {
            id: 1,
            name: "Akarsh K",
            address: "Ram heavens road no 8 rama heavens flat no 103\nRamnagar\nHyderabad - 500050",
            type: "Home",
            isSelected: true,
        },
        {
            id: 2,
            name: "Akarsh K",
            address: "Ram heavens road no 8 rama heavens flat no 103\nRamnagar\nHyderabad - 500050",
            type: "Office",
            isSelected: false,
        },
        {
            id: 3,
            name: "Akarsh K",
            address: "Ram heavens road no 8 rama heavens flat no 103\nRamnagar\nHyderabad - 500050",
            type: "Office",
            isSelected: false,
        },
    ];

    return (
        <div className="max-w-xl mx-auto bg-gray-900 text-white rounded-lg p-4">
            <h2 className="text-lg font-bold text-center mb-4">My Addresses</h2>
            <button className="flex items-center text-green-400 font-medium hover:text-green-300 mb-4">
                <span className="text-xl mr-2">+</span> Add new address
            </button>
            <div className="divide-y divide-gray-800">
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        name={address.name}
                        address={address.address}
                        type={address.type}
                        isSelected={address.isSelected}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyAddresses;
