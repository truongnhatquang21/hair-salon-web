"use client ";

import { useSession } from "next-auth/react";
import { getTranslations } from "next-intl/server";

import { Hello } from "@/components/Hello";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "Dashboard",
  });

  return {
    title: t("meta_title"),
  };
}

const Dashboard = () => {
  const session = useSession;
  console.log(session, "KOOO");
  return (
    <div className="[&_p]:my-6">
      <Hello />
    </div>
  );
};

export default Dashboard;
