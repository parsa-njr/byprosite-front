import React, { useState } from "react";
import EnterPhone from "../component/EnterPhone";
import VerifyOtp from "../component/VerifyOtp";
import SignUpForm from "../component/SignUpForm";

// 🔹 Types for props


export interface SignUpFormProps {
  userId: string | null;
}

// 🔹 Main component
const SignUpPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <>
      {page === 1 && (
        <EnterPhone
          setPhoneNumber={setPhoneNumber}
          mode="signUp"
          setPage={setPage}
        />
      )}
      {page === 2 && (
        <VerifyOtp
          phoneNumber={phoneNumber}
          setPage={setPage}
          mode="signUp"
          setUserId={setUserId}
        />
      )}
      {page === 3 && <SignUpForm userId={userId} />}
    </>
  );
};

export default SignUpPage;
