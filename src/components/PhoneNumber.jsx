"use client";

import { useState } from "react";
import axios from "axios";

export default function PhoneForm() {
  const [phone, setPhone] = useState("");

  const save = async () => {
    await axios.post("/api/phone", { phoneNumber: phone });
    window.location.href = "/profile";
  };

  return (
    <div className="text-center flex items-center w-[80%] mx-auto gap-3">
      <input
        className="p-2 border shadow-[10px_10px_0px_0px_rgba(0,0,0)] outline-none font-bold"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        onClick={save}
        className="ml-2 px-4 py-2 bg-black text-white mt-2 cursor-pointer"
      >
        Save
      </button>
    </div>
  );
}
