"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CountryList from 'country-list-with-dial-code-and-flag';
import toast, { Toaster } from 'react-hot-toast';

export default function PhoneForm() {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState("+1");
  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    const fullPhoneNumber = selectedDialCode + phone.replace(/\D/g, '');
    
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(fullPhoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      const loadingToast = toast.loading("Saving phone number...");
      await axios.post("/api/phone", { phoneNumber: fullPhoneNumber });
      
      toast.dismiss(loadingToast);
      toast.success("Phone number saved successfully!");
      
      // Small delay before redirect
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1500);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to save phone number. Please try again.");
      console.error("Error saving phone number:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchCountries = async () => {
      try {
        toast.loading("Loading countries...");
        const countries = CountryList.getAll();
        
        if (isMounted) {
          setCountry(countries);
          toast.dismiss();
          toast.success("Countries loaded!");
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        if (isMounted) {
          setCountry([]);
          toast.error("Failed to load countries");
        }
      }
    };
    
    fetchCountries();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            border: '2px solid #000',
            boxShadow: '5px 5px 0px 0px rgba(0,0,0)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#1f2937',
            },
          },
        }}
      />
      
      <div className="text-center flex flex-col items-center sm:flex-row md:w-[100%] sm:w-[100%] mx-auto gap-3 md:gap-6 md:p-4 sm:p-1">
        
        {/* Country Select */}
        <select 
          className="w-[70%] lg:w-[30%] p-2 border shadow-[10px_10px_0px_0px_rgba(0,0,0)] outline-none font-bold text-sm sm:text-base"
          value={selectedDialCode}
          onChange={(e) => setSelectedDialCode(e.target.value)}
          disabled={isLoading}
        >
          {country.map((countryItem, index) => (
            <option key={index} value={countryItem.data.dial_code}>
              ({countryItem.data.dial_code}) {countryItem.data.name}
            </option>
          ))}
        </select>
        
        {/* Phone Input */}
        <input
          className="w-full sm:flex-1 p-2 border shadow-[10px_10px_0px_0px_rgba(0,0,0)] outline-none font-bold text-sm sm:text-base"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          type="tel"
          disabled={isLoading}
        />
        
        {/* Save Button */}
        <button
          onClick={save}
          disabled={isLoading}
          className={`w-full sm:w-auto px-4 py-2 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-black hover:shadow-none transform-border border-2 mt-5 sm:mt-0 cursor-pointer text-sm sm:text-base whitespace-nowrap transition-all duration-150 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2'}`}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        
      </div>
    </>
  );
}