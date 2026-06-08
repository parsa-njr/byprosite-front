// components/Loader.tsx
import headerIcon from "@/assets/images/mainLogo.png";

export default function Loader() {
  return (
    <div  className="flex items-center  justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="absolute inset-0  flex items-center justify-center bg-white/40 backdrop-blur-3xl">
        {/* Outer gradient ring */}
        <div className="w-28 h-28 rounded-full border-4 border-transparent animate-spin 
                        bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-400 
                        [mask-image:linear-gradient(white,transparent)]"></div>

        {/* Middle soft glow ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-blue-300 animate-pulse opacity-50"></div>

        {/* Logo at the center */}
        <img
          className="absolute w-16 h-16 animate-bounce"
          src={headerIcon}
          alt="Loading Logo"
        />

        {/* Floating particle effect */}
        {/* <div className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping top-0 left-1/2 -translate-x-1/2"></div> */}
      </div>
    </div>
  );
}
