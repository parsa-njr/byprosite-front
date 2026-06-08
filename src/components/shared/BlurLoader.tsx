// components/Loader.tsx
import headerIcon from "@/assets/images/mainLogo.png";

export default function BlurLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
                 bg-white/40 backdrop-blur-sm"
    >
      {/* Outer gradient ring */}
      <div
        className="relative w-28 h-28 rounded-full border-4 border-transparent animate-spin 
                   bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-400 
                   [mask-image:linear-gradient(white,transparent)]"
      ></div>

      {/* Middle soft glow ring */}
      <div className="absolute w-20 h-20 rounded-full border-4 border-blue-300 animate-pulse opacity-50"></div>

      {/* Center logo */}
      <img
        className="absolute w-16 h-16 animate-bounce"
        src={headerIcon}
        alt="Loading Logo"
      />
    </div>
  );
}
