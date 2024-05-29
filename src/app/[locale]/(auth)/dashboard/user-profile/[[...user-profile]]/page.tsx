import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "UserProfile",
  });

  return {
    title: t("meta_title"),
  };
}

const UserProfilePage = () => <div className="my-6 -ml-16"></div>;

export default UserProfilePage;
