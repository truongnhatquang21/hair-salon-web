import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import about from "@/public/assets/images/about-us.jpg";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "About",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function About() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-5">
        <Image
          src={about}
          alt="About Bookminton"
          width={800}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <div className="flex flex-col">
          <div className="mt-4">
            <h1 className="mb-6 text-4xl font-bold">{t("title")}</h1>
            <p className="mb-4">
              {t("description", {
                platformName: "Bookminton",
              })}
            </p>
            <h2 className="mb-4 text-xl font-semibold">
              {t("section5_title")}
            </h2>
            <p className="mb-4">{t("section5_content")}</p>
          </div>

          <div className="my-5 mb-10 flex justify-center">
            <Link
              href="/contact"
              className="mx-auto rounded-sm bg-green-700 px-6 py-4 font-bold text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-4 mt-2 flex gap-4">
        <div className="rounded-lg border border-green-500 bg-emerald-500 p-3 text-white shadow-md">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            {t("section1_title")}
          </h2>
          <p className="mb-4">{t("section1_content")}</p>
        </div>
        <div className="rounded-lg border border-green-500 bg-emerald-500 p-3 text-white shadow-md">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            {t("section2_title")}
          </h2>
          <p className="mb-4">{t("section2_content")}</p>
        </div>
        <div className="rounded-lg border border-green-500 bg-emerald-500 p-3 text-white shadow-md">
          <h2 className="mb-4 text-center text-2xl font-semibold">
            {t("section3_title")}
          </h2>
          <p className="mb-4">{t("section3_content")}</p>
        </div>
      </div>
    </div>
  );
}
