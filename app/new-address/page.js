"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/app/componenets/topbar";
import { SideNav } from "@/app/componenets/sideNav";
import Footer from "../componenets/footer";

export default function NewAddress() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    addressType: "",
    address: "",
    landmark: "",
    locality: "",
    pincode: "",
    district: "",
    city: "",
    state: "",
    country: "India",
    setActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/new-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        if (redirectPath === "cart") {
          router.push("/cart");
        } else {
          router.push("/addresses");
        }
      } else {
        const data = await response.json();
        setError(data.message || "Failed to add address");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressDetails = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const [data] = await response.json();

      if (data.Status === "Success") {
        const { District, State } = data.PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          district: District,
          state: State,
        }));
      } else {
        setError("Invalid pincode");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setError("Failed to fetch address details");
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: value }));

    if (value.length === 6) {
      fetchAddressDetails(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#191919]">
      <TopBar />

      <div className="flex-grow mx-auto w-full px-4 md:px-6 lg:pt-36 pt-20 container">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="hidden md:block">
            <SideNav />
          </div>

          <div className="flex-1">
            <div className="mb-6 md:mb-8">
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
                <h1 className="md:text-3xl text-xl font-bold text-white">
                  Add New Address
                </h1>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits (0-9)
                      const numericValue = value.replace(/[^0-9]/g, "");
                      // Limit to 10 digits
                      const limitedValue = numericValue.slice(0, 10);
                      setFormData({ ...formData, mobile: limitedValue });
                    }}
                    placeholder="Enter 10 digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Address Type
                  </label>
                  <select
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.addressType}
                    onChange={(e) =>
                      setFormData({ ...formData, addressType: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                    placeholder="Enter landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Locality
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.locality}
                    onChange={(e) =>
                      setFormData({ ...formData, locality: e.target.value })
                    }
                    placeholder="Enter locality"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    maxLength={6}
                    placeholder="Enter 6 digit pincode"
                  />
                  {pincodeLoading && (
                    <span className="text-sm text-gray-400 mt-1 block">
                      Fetching address details...
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    disabled={pincodeLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    disabled={pincodeLoading}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="setActive"
                    className="w-4 h-4 bg-[#222222] border-[#222222] rounded text-[#FF3333] focus:ring-[#FF3333]"
                    checked={formData.setActive}
                    onChange={(e) =>
                      setFormData({ ...formData, setActive: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="setActive"
                    className="text-sm md:text-base text-gray-200"
                  >
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#FF3333] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? "Adding..." : "Add Address"}
                  {redirectPath === "cart" ? " & Continue to Checkout" : ""}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-36 md:pt-36">
        <Footer />
      </div>
    </div>
  );
}
