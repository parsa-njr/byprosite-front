import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { useCheckLogin } from "@/query/auth/useAuth";
import { useUserStore } from "@/stores/useUserStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { mutate: checkLogin } = useCheckLogin();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin(undefined, {
      onSuccess: (res: any) => {
        console.log(res);
        setUser(res.data?.detail?.user); // ✅ save user to Zustand
        setIsLoggedIn(true);
      },
      onError: () => {
        navigate("/login");
      },
    });
  }, [checkLogin, navigate, setUser]);

  if (!isLoggedIn) return <Loader />;

  return <>{children}</>;
}
