import React, { useEffect, useState } from "react";
import EnterPhone from "../component/EnterPhone";
import VerifyOtp from "../component/VerifyOtp";
import LoginWithPassword from "../component/LoginWithPassword";
import ForgetPassword from "../component/ForgetPassword";

const LogIn = () => {
  const [page, setPage] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    console.log("phoneNumber :: ", phoneNumber);
  }, [phoneNumber]);

  return (
    <>
      {page === 1 && (
        <>
          <LoginWithPassword
            setPhoneNumber={setPhoneNumber}
            setPage={setPage}
          />
        </>
      )}

      {page === 2 && (
        <>
          <EnterPhone
            setPhoneNumber={setPhoneNumber}
            phoneNumber={phoneNumber}
            mode="login"
            setPage={setPage}
          />
        </>
      )}

      {page === 3 && (
        <>
          <VerifyOtp
            // setUserId={null}
            phoneNumber={phoneNumber}
            mode="login"
            setPage={setPage}
          />
        </>
      )}

      {page === 4 && (
        <>
          <EnterPhone
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            mode="forgetPassword"
            setPage={setPage}
          />
        </>
      )}

      {page === 5 && (
        <>
          <VerifyOtp
            // setUserId={null}
            phoneNumber={phoneNumber}
            mode="forgetPassword"
            setPage={setPage}
          />
        </>
      )}
      {page === 6 && (
        <>
          <ForgetPassword
            phoneNumber={phoneNumber}
            mode="forgetPassword"
            setPage={setPage}
          />
        </>
      )}
    </>
  );
};

export default LogIn;
