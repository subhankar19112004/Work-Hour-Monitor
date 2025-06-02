// import React from 'react';

// const InactivityModal = ({ isOpen, onReset }) => {
//   console.log('Modal Open:', isOpen); // Debug log to see if modal opens

//   if (!isOpen) return null; // If not open, return nothing.

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-xl bg-opacity-50">
//       <div className="bg-white p-4 rounded-lg shadow-lg text-center">
//         <h3 className="text-xl">You have been inactive for 5 minutes.</h3>
//         <p className="mt-2">Are you still here?</p>
//         <button
//           onClick={onReset}
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           I'm here
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InactivityModal;


import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function InactivityModal({ isOpen, onReset }) {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(60); // 60s countdown

  useEffect(() => {
    let timer;
    if (isOpen) {
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            dispatch(logout());
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Are you still there?</h2>
        <p className="mb-4 text-gray-700">You’ve been inactive for a while. You’ll be logged out in <span className="font-bold text-red-500">{countdown}s</span>.</p>
        <button
          onClick={onReset}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          I'm here
        </button>
      </div>
    </div>
  );
}

