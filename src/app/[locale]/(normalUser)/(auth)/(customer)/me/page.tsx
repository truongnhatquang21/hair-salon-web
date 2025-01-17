import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "profile",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

const Profile = () => {
  return <div>emty page</div>;
};

export default Profile;
