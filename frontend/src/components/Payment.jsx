import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const EsewaPayment = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const handlePayment = async (e) => {
    e.preventDefault();
    const payload = {
      amount: Number(amount),
      profname: "Sophia Lama",
      slotdate: "1_6_2025",
      slottime: "10:30 AM",
    };
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/initiate-esewa`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Esewa initiation response:", res.data);

      if (res?.data?.url) {
        window.location.href = res.data.url; // redirect to eSewa payment URL
      } else {
        alert("Payment initiation failed. Try again.");
      }
    } catch (error) {
      console.error("Esewa Error", error);
      alert("Payment Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-xl font-bold">eSewa Payment Integration</h1>

      <form
        className="mt-6 flex flex-col gap-3 items-center"
        onSubmit={handlePayment}
      >
        <label htmlFor="amount" className="text-sm font-semibold">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="px-4 py-2 border rounded-md outline-none"
          required
        />

        <button
          type="submit"
          className="mt-2 bg-[#79b33d] text-white px-6 py-2 rounded hover:bg-[#69a12f] transition"
        >
          Pay with eSewa
        </button>
      </form>
    </div>
  );
};

export default EsewaPayment;
