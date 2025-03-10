'use client';

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

function ReservationProvider({ children }) {
  const [range, setRange] = useState({ from: undefined, to: undefined });

  function resetRange() {
    setRange({ from: undefined, to: undefined });
  }


  const value = { range, setRange, resetRange };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservation must be used within a Provider");

  return context;
}

export { ReservationProvider, useReservation };