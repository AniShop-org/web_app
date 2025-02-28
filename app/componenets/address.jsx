"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./sideNav";
import { TopBar } from "./topbar";
import Footer from "./footer";
import { AddressCard } from "./addressCard";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);

  if (typeof window != "undefined") {
    if (!localStorage.getItem("authToken")) {
      router.push("/login");
    }
  }

  useEffect(() => {
    // Fetch active address first
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/active-address`,
      {
        headers: {
          Authorization:
            typeof window !== "undefined"
              ? localStorage.getItem("authToken")
              : "",
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success" && data.address) {
          setSelectedAddressId(data.address.id);
        }
      })
      .catch((err) => console.error("Error fetching active address:", err));

    // Fetch all addresses
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/address`, {
      headers: {
        Authorization:
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success") {
          setAddresses(data.addresses);
          setLoading(false);
        }
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, []);

  const handleAddressSelect = async (addressId) => {
    try {
      setSelectingId(addressId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/active-address/${addressId}`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              typeof window !== "undefined"
                ? localStorage.getItem("authToken")
                : "",
          },
        },
      );
      const data = await response.json();
      if (data.status === "Success") {
        setSelectedAddressId(addressId);
      }
    } catch (error) {
      console.error("Error setting active address:", error);
    } finally {
      setSelectingId(null);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      setDeletingId(addressId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/delete-address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              typeof window !== "undefined"
                ? localStorage.getItem("authToken")
                : "",
          },
        },
      );
      const data = await response.json();
      if (data.status === "Success") {
        setAddresses((prev) =>
          prev.filter((address) => address.id !== addressId),
        );
      } else if (data.status === 400) {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to remove address, try again later");
      console.error("Error removing address:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#191919] lg:pt-36 pt-16">
      <TopBar />
      <div className="flex-grow container mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        <div className="pr-10">
          <SideNav />
        </div>
        <div className="flex-grow">
          <div className="">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center md:gap-4 gap-2">
                <button
                  onClick={() => router.back()}
                  className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-4 sm:h-6 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <h2 className="sm:text-3xl text-2xl text-white font-bold">
                  My Addresses
                </h2>
              </div>
              <button
                className="inline-flex items-center bg-white hover:bg-neutral-100 transition-colors text-black text-xs sm:text-sm sm:px-3 px-1 py-1.5 rounded-lg"
                onClick={() => router.push("/new-address")}
              >
                <span className="mr-1 sm:text-base text-xs bg-white">+</span>{" "}
                Add new address
              </button>
            </div>
          </div>
          <div>
            {loading ? (
              <div className="flex justify-center content-center pt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No addresses found</h3>
                <p className="text-gray-400">Add an address to see it here.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isSelected={address.id === selectedAddressId}
                  onSelect={handleAddressSelect}
                  onRemove={handleRemoveAddress}
                  isSelecting={selectingId === address.id}
                  isDeleting={deletingId === address.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAddresses;
