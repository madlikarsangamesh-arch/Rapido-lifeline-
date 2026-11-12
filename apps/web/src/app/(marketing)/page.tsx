
"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

const ambulanceTypes = [
  { name: "BLS", description: "Basic Life Support" },
  { name: "ALS", description: "Advanced Life Support" },
  { name: "ICU", description: "Critical care transport" },
  { name: "Patient Transport", description: "Planned patient transfers" },
  { name: "Neonatal", description: "Newborn patient transport" },
];

export default function MarketingHomePage() {
  const [pickup, setPickup] = useState("");
  const [hospital, setHospital] = useState("");
  const [ambulance, setAmbulance] = useState("BLS");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pickup.trim() || !hospital.trim()) {
      setError("Please enter both pickup and hospital locations.");
      return;
    }

    setError("");
    setBooking(true);
  }

  return (
    <main className="min-h-screen bg-[#F7FAF8] text-[#101828]">
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-center text-xs font-bold text-emerald-800">
        PROTOTYPE, TEST DATA · SIMULATED BOOKINGS
      </div>

      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B7D43] text-white p-3 rounded-xl">
            <Activity size={25} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl">Rapid Lifeline</h1>
            <p className="text-xs text-slate-500">Private ambulance coordination</p>
          </div>
        </div>
        <a href="#booking" className="bg-[#0B7D43] text-white px-5 py-3 rounded-xl font-bold text-sm">
          Book ambulance
        </a>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[#0B7D43] font-bold text-sm">
            CARE. COORDINATION. CLARITY.
          </span>

          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight mt-5">
            Every moment matters.
            <span className="text-[#0B7D43]"> Every connection counts.</span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            A coordinated ambulance experience designed to connect patients,
            ambulance operators and hospitals through one platform.
          </p>

          <a href="#booking" className="inline-flex items-center gap-3 mt-8 bg-[#0B7D43] text-white px-7 py-4 rounded-xl font-bold hover:bg-[#09663A]">
            Explore booking demo <ArrowRight size={19} />
          </a>

          <div className="grid grid-cols-2 gap-6 mt-12 border-t pt-7">
            <div className="flex gap-3">
              <ShieldCheck className="text-[#0B7D43] shrink-0" />
              <div>
                <p className="font-bold text-sm">Transparent service</p>
                <p className="text-xs text-slate-500 mt-1">Clear prototype status</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Activity className="text-[#0B7D43] shrink-0" />
              <div>
                <p className="font-bold text-sm">Patient focused</p>
                <p className="text-xs text-slate-500 mt-1">Simple booking experience</p>
              </div>
            </div>
          </div>
        </div>

        <div id="booking" className="bg-white rounded-3xl border border-slate-200 shadow-xl p-7">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-bold text-[#0B7D43] uppercase tracking-widest">
                Booking experience
              </p>
              <h3 className="text-2xl font-extrabold mt-2">Request an ambulance</h3>
            </div>
            <Truck size={34} className="text-[#0B7D43]" />
          </div>

          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label htmlFor="pickup" className="block font-bold text-sm mb-2">
                Pickup location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={19} />
                <input
                  id="pickup"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address"
                  className="w-full border border-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-[#0B7D43]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hospital" className="block font-bold text-sm mb-2">
                Destination hospital
              </label>
              <input
                id="hospital"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Enter hospital name"
                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0B7D43]"
              />
            </div>

            <div>
              <p className="font-bold text-sm mb-3">Select ambulance category</p>
              <div className="grid grid-cols-2 gap-3">
                {ambulanceTypes.map((type) => (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setAmbulance(type.name)}
                    className={`border rounded-xl p-3 text-left transition ${
                      ambulance === type.name
                        ? "border-[#0B7D43] bg-emerald-50 ring-1 ring-[#0B7D43]"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <span className="font-bold text-sm block">{type.name}</span>
                    <span className="text-xs text-slate-500">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0B7D43] hover:bg-[#09663A] text-white rounded-xl py-4 font-bold"
            >
              Continue with demo booking <ArrowRight className="inline ml-2" size={18} />
            </button>

            <p className="text-center text-xs text-slate-400">
              Demonstration only. No real ambulance will be dispatched.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-white border-y py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center">Designed for coordinated care</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              ["01", "Request", "Enter pickup details and select the required transport category."],
              ["02", "Coordinate", "Review patient transport and destination information."],
              ["03", "Track", "View clear status updates when connected services become available."],
            ].map(([number, title, description]) => (
              <div key={number} className="border border-slate-200 rounded-2xl p-7">
                <span className="text-[#0B7D43] font-extrabold">{number}</span>
                <h3 className="text-xl font-bold mt-4">{title}</h3>
                <p className="text-slate-500 text-sm leading-7 mt-3">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#10251B] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold">Rapid Lifeline</h2>
          <p className="text-slate-300 text-sm leading-7 mt-4 max-w-3xl">
            Rapid Lifeline is a private ambulance coordination platform, not a
            government emergency response service. This prototype uses test data.
            It does not connect to real ambulance operators, hospitals, dispatch
            systems or live GPS. It does not provide medical advice.
          </p>
          <p className="text-xs text-slate-400 mt-8">
            © {new Date().getFullYear()} Rapid Lifeline · Prototype, test data
          </p>
        </div>
      </footer>

      {booking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl">
            <div className="flex justify-between">
              <CheckCircle2 className="text-[#0B7D43]" size={36} />
              <button onClick={() => setBooking(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <h2 className="text-2xl font-extrabold mt-5">Demo request created</h2>
            <div className="bg-slate-50 rounded-xl p-4 mt-5 space-y-3 text-sm">
              <p><b>Pickup:</b> {pickup}</p>
              <p><b>Hospital:</b> {hospital}</p>
              <p><b>Ambulance:</b> {ambulance}</p>
            </div>
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl mt-4 leading-5">
              Simulated confirmation only. No real booking, ambulance assignment
              or hospital notification has occurred.
            </p>
            <button
              onClick={() => {
                setBooking(false);
                setPickup("");
                setHospital("");
                setAmbulance("BLS");
              }}
              className="w-full bg-[#0B7D43] text-white rounded-xl py-3 font-bold mt-5"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
