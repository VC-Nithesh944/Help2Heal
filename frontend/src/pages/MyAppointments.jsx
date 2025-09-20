import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { load } from "@cashfreepayments/cashfree-js";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Network error"
      );
    }
  };

  // Cashfree payment integration
  const appointmentCashfree = async (appointmentId) => {
    try {
      // create order & get payment_session_id from backend
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-cashfree`,
        { appointmentId },
        { headers: { token } }
      );
      if (!data.success)
        throw new Error(data.message || "Order creation failed");

      const cashfree = await load({ mode: "sandbox" });
      const result = await cashfree.checkout({
        paymentSessionId: data.order.payment_session_id,
        redirectTarget: "_modal",
      });

      // If the SDK returns paymentDetails, verify on backend and refresh UI
      if (result.paymentDetails) {
        // attempt server-side verification (safer than trusting client-only)
        const markResp = await axios.post(
          `${backendUrl}/api/user/mark-appointment-paid`,
          { appointmentId },
          { headers: { token } }
        );
        if (markResp.data?.success) {
          await getUserAppointments(); // refresh to reflect paid=true
          toast.success("Payment successful and verified");
        } else {
          // not marked on server — show message and still refresh to get latest
          await getUserAppointments();
          toast.info(
            markResp.data?.message || "Payment completed; verification pending"
          );
        }
      } else if (result.error) {
        toast.error("Payment failed or was closed");
      } else {
        // fallback: attempt verification anyway after a short delay
        setTimeout(async () => {
          const markResp = await axios.post(
            `${backendUrl}/api/user/mark-appointment-paid`,
            { appointmentId },
            { headers: { token } }
          );
          if (markResp.data?.success) {
            await getUserAppointments();
            toast.success("Payment verified");
          } else {
            toast.info(markResp.data?.message || "Payment not verified yet");
          }
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment initiation failed."
      );
      console.error("appointmentCashfree error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-2xl font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr]  gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}>
            <div>
              <img
                className="w-34 bg-indigo-50 rounded border-1 border-gray-500 shadow-lg"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && !item.paid && (
                <button
                  onClick={() => appointmentCashfree(item._id)}
                  className="text-sm text-neutral-800 text-center sm:min-w-48 py-2 border rounded transition-all duration-300 hover:bg-green-500 hover:text-white active:bg-green-500">
                  Pay Online
                </button>
              )}
              {!item.cancelled && item.paid && (
                <button
                  disabled
                  className="text-sm text-white bg-green-600 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed">
                  Paid
                </button>
              )}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-neutral-800 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all active:bg-red-500 active:duration-10 duration-300">
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-red-900 rounded text-red-700">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyAppointments;
