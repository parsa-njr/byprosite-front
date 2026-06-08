import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import mainLogo from "@/assets/images/mainLogo.png";

export default function IconBox() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[190px] h-[190px]">
        <div className="relative w-full h-full bg-neutral-100 rounded-full shadow-[0px_4px_10px_#00000040]">
          <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-40 h-40 bg-neutral-100 rounded-full shadow-[0px_0px_20px_#00000040]" />
          <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[130px] h-[130px] bg-white rounded-full shadow-[0px_0px_20px_#00000040]" />

          <Avatar className="absolute top-[42px] left-1/2 -translate-x-1/2 w-[107px] h-[107px]">
            <AvatarImage src={mainLogo} alt="Photo" className="object-cover" />
            <AvatarFallback>PH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
