import React from "react";
import { redirect } from "next/navigation";
import LandingPage from "./landingPage";
import { getCurrentUser } from "./actions/action1";

const Page = async () => {
  const user = await getCurrentUser();

  // ✅ If user exists, redirect based on role
  if (user) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else if (user.role === "USER") {
      redirect("/user");
    } else if (user.role === "CUSTODIAN") {
      redirect("/custodian/profile");
    }
  }

  // ✅ If no user is logged in, show landing page
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default Page;
