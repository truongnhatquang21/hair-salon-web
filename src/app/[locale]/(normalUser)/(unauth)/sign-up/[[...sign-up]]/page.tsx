import { getTranslations } from "next-intl/server";
import React from "react";

import SignUp from "@/views/auth/signUp";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "SignUp",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}
export default function AuthenticationPage() {
  return <SignUp />;
}
