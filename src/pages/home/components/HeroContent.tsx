import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HeroContent = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = localStorage.getItem("accessToken");
  const onCreateAdClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accessToken = localStorage.getItem("accessToken"); // still string | null

    if (user?.userVerificationLevel === "LevelTwoRegistration") {
      navigate(`/advertisementForm/0`);
    } else {
      const validateLevelOne =
        user?.userVerificationLevel === "LevelOneRegistration";
      Swal.fire({
        title: validateLevelOne
          ? "برای ثبت آگهی ابتدا باید اطلاعات خود را تکمیل کنید"
          : "برای ثبت آگهی باید وارد حساب کاربری خود شوید",
        allowOutsideClick: false,
        icon: "warning",
        position: "center",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: validateLevelOne
          ? "تکمیل اطلاعات"
          : "ثبت نام / ورود",
        cancelButtonText: "بستن",
        width: "400px",
        buttonsStyling: false, // Disable default styles to apply custom styles
        customClass: {
          popup: "font-sansWeb ", // Apply the Tailwind font class
          title: "font-sansWeb !text-sm",
          confirmButton:
            "bg-primary cursor-pointer hover:opcity-[85] text-white text-[16px] mx-[20px] mt-[30px] py-2 px-4 rounded font-sansWeb ",
          cancelButton:
            "bg-secondary cursor-pointer hover:opcity-[85] text-white py-2 px-4 rounded ml-2  text-[16px] mt-[30px] font-sansWeb ",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          if (user?.userVerificationLevel === "LevelOneRegistration") {
            navigate(`/sign-up-level-two?backUrl=advertisementForm/0`); // Navigates to /about
          } else {
            navigate(
              `/login?backUrl=sign-up-level-two&backupUrl=advertisementForm/0`
            );
          }
        }
      });
    }
  };

  console.log("user?.userVerificationLevel : ", user?.userVerificationLevel);

  return (
    <div className="relative z-10 mt-20  mx-auto p-8 md:p-16 flex justify-center md:justify-start">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-6 leading-20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-secondary mx-2"> محیط زیست </span>
          امانتی است از آیندگان نزد ما
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl  p-5 text-white mb-8 leading-relaxed   text-wrap  mx-auto"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          مرکز خرید و فروش انواع ضایعات آهن، آلومینیوم، استیل، مس، چدن، برنج،
          سیم و کابل، تیرآهن، میلگرد، ناودانی، لوله، ورق، مفرغ، کاغذ باطله و
          کلیه ضایعات فلزی شرکت‌ها، ساختمانی و صنعتی با بالاترین قیمت
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 mt-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="relative flex-1 ">
            <Input
              type="text"
              placeholder="جستجوی هوشمند"
              className="w-full h-12 md:h-16 p-4 pr-12 border rounded-[120px] !text-lg md:!text-2xl
              text-white border-[#75757580]  bg-[#75757580] text-right"
            />
            <div
              className="bg-secondary rounded-[120px] h-full
               absolute left-0  top-1/2 transform -translate-y-1/2 text-white
               hover:cursor-pointer hover:opacity-85"
            >
              <Search size={50} className="mx-8 mt-0 md:mt-1" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-20 md:mb-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Button
            onClick={() => onCreateAdClick()}
            className="bg-secondary h-12 md:h-16 text-lg md:text-2xl rounded-[120px] w-36 md:w-64 
          hover:opacity-85 hover:bg-secondary hover:cursor-pointer px-6 py-3 "
          >
            ثبت آگهی
          </Button>
          {(!accessToken ||
            (!user?.userVerificationLevel ||
              user?.userVerificationLevel === "None")) && (
              <>
                <Button
                  onClick={() => {
                    const storedUser = localStorage.getItem("user");
                    const user = storedUser ? JSON.parse(storedUser) : null;
                    if (
                      user?.userVerificationLevel === "LevelOneRegistration"
                    ) {
                      navigate(`/sign-up-level-two`);
                    } else {
                      navigate(`/login`);
                    }
                  }}
                  className="bg-secondary w-36 md:w-64 text-lg md:text-2xl h-12 md:h-16 rounded-[120px] 
          hover:opacity-85 hover:bg-secondary
          hover:cursor-pointer px-6 py-3"
                >
                  عضویت/ورود
                </Button>
              </>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
