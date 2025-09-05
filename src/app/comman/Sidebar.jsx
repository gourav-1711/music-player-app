import { X } from "lucide-react";

export default function Sidebar({ open, setOpen, children }) {
  return (
    <div
      className={`z-[100000] fixed top-0 right-0 h-screen w-[30%] bg-white shadow-lg transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header with X button */}
      <div className="flex justify-end p-4 border-b">
        <button onClick={() => setOpen(false)}>
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
