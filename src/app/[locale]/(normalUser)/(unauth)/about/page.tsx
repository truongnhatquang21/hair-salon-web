import {
  Calendar,
  CalendarCheck,
  Clock,
  Eye,
  HandHeart,
  Laptop,
  MapPin,
  Settings,
  UserRound,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import about from "@/public/assets/images/about-us.jpg";
import chosen from "@/public/assets/images/why-choose-us.jpg";

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
    <div className="container mx-auto rounded-md p-4">
      <div className="relative flex h-[400px] justify-center rounded-lg">
        <div className="absolute inset-0 rounded-md">
          <Image
            src={about}
            alt="About us"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="opacity-90"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
          <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
          <p className="mb-4 w-2/4">
            {t("description", {
              platformName: "Bookminton",
            })}
          </p>
          <div>
            <Link
              href="/contact"
              className="rounded-full bg-green-700 px-6 py-2 font-bold text-white hover:bg-green-800"
            >
              {t("contact_button")}
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-4 mt-10 grid grid-cols-4 gap-5">
        <div className="rounded-lg bg-zinc-100 p-3 shadow-md">
          <div className="mb-3 flex justify-center">
            <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
              <HandHeart className="text-white" size={40} />
            </Button>
          </div>
          <h2 className="mb-4 text-center text-xl font-semibold">
            {t("section1_title")}
          </h2>
          <p className="mb-4 text-center">{t("section1_content")}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 shadow-md">
          <div className="mb-3 flex justify-center">
            <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
              <Zap className="text-white" size={40} />
            </Button>
          </div>
          <h2 className="mb-4 text-center text-xl font-semibold">
            {t("section2_title")}
          </h2>
          <p className="mb-4 text-center">{t("section2_content")}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 shadow-md">
          <div className="mb-3 flex justify-center">
            <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
              <UserRound className="text-white" size={40} />
            </Button>
          </div>
          <h2 className="mb-4 text-center text-xl font-semibold">
            {t("section4_title")}
          </h2>
          <p className="mb-4 text-center">{t("section4_content")}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 shadow-md">
          <div className="mb-3 flex justify-center">
            <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
              <Eye className="text-white" size={40} />
            </Button>
          </div>
          <h2 className="mb-4 text-center text-xl font-semibold">
            {t("section3_title")}
          </h2>
          <p className="mb-4 text-center">{t("section3_content")}</p>
        </div>
      </div>
      <div className="my-10 flex gap-5">
        <div className="w-2/4">
          <Image
            src={chosen}
            alt="Why choose us"
            objectFit="cover"
            objectPosition="center"
            width={800}
            height={300}
            className="rounded-md"
          />
        </div>
        <div className="flex w-2/4 flex-col">
          <div className="mt-4">
            <div className="mb-6">
              <span className="mb-4 rounded-full bg-green-300 px-4 py-1 text-center text-xl font-semibold">
                {t("section11_title")}
              </span>
            </div>
            <div>
              <div className="flex gap-5">
                <div>
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <Calendar className="text-white" size={40} />
                  </Button>
                </div>
                <div>
                  <p className="mb-2 font-semibold">
                    {t("section11_content_heading_1")}
                  </p>
                  <p>{t("section11_content_1")}</p>
                </div>
              </div>
              <div className="my-5 flex gap-5">
                <div>
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <Settings className="text-white" size={40} />
                  </Button>
                </div>
                <div>
                  <p className="mb-2 font-semibold">
                    {t("section11_content_heading_1")}
                  </p>
                  <p>{t("section11_content_1")}</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div>
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <MapPin className="text-white" size={40} />
                  </Button>
                </div>
                <div>
                  <p className="mb-2 font-semibold">
                    {t("section11_content_heading_1")}
                  </p>
                  <p>{t("section11_content_1")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4 flex gap-5 rounded-sm bg-zinc-100 px-6 py-5">
        <div className="flex ">
          <div className="mt-4 flex flex-col items-center">
            <span className="mb-4 rounded-full bg-green-300 px-3 py-1 font-semibold">
              {t("section10_sub_title")}
            </span>
            <h2 className="mb-4 text-center text-xl font-semibold">
              {t("section10_title")}
            </h2>
            <div className="grid grid-cols-4 gap-5">
              <div className="rounded-lg bg-white p-3 shadow-md">
                <div className="mb-3 flex justify-center">
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <Laptop className="text-white" size={40} />
                  </Button>
                </div>
                <h2 className="mb-4 text-center text-lg font-semibold">
                  {t("section10_content_heading_1")}
                </h2>
                <p className="mb-4 text-center">{t("section10_content_1")}</p>
              </div>
              <div className="rounded-lg  bg-white p-3 shadow-md">
                <div className="mb-3 flex justify-center">
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <Clock className="text-white" size={40} />
                  </Button>
                </div>
                <h2 className="mb-4 text-center text-lg font-semibold">
                  {t("section10_content_heading_2")}
                </h2>
                <p className="mb-4 text-center">{t("section10_content_2")}</p>
              </div>
              <div className="rounded-lg  bg-white p-3 shadow-md">
                <div className="mb-3 flex justify-center">
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <CalendarCheck className="text-white" size={40} />
                  </Button>
                </div>
                <h2 className="mb-4 text-center text-lg font-semibold">
                  {t("section10_content_heading_3")}
                </h2>
                <p className="mb-4 text-center">{t("section10_content_3")}</p>
              </div>
              <div className="rounded-lg  bg-white p-3 shadow-md">
                <div className="mb-3 flex justify-center">
                  <Button className="mx-auto size-[50px] rounded-full bg-green-800 hover:bg-green-900">
                    <Settings className="text-white" size={40} />
                  </Button>
                </div>
                <h2 className="mb-4 text-center text-lg font-semibold">
                  {t("section10_content_heading_4")}
                </h2>
                <p className="mb-4 text-center">{t("section10_content_4")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
