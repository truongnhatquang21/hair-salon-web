"use client";

import { Mail, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contact from "@/public/assets/images/contact-us.jpg";

export default function Contact() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulated email sending logic
      console.log("Email sent:", formData);
      // Clear the form after submission (simulated behavior)
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error: show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative flex h-[400px] justify-center rounded-lg">
        <div className="absolute inset-0 rounded-md">
          <Image
            src={contact}
            alt="Contact us"
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
              href="#contactForm"
              className="rounded-full bg-green-700 px-6 py-2 font-bold text-white hover:bg-green-800"
            >
              {t("contact_button")}
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-40 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div>
            <div className="rounded-lg bg-white px-6 py-4">
              <p className="flex gap-5">
                <Button className="my-auto size-[50px] rounded-full bg-green-200 hover:bg-green-300">
                  <PhoneCall className="text-green-800" size={45} />
                </Button>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    {t("phone_number_title")}
                  </span>
                  <span className="">{t("phone_number")}</span>
                </div>
              </p>
            </div>
            <div className="my-5 rounded-lg bg-white px-6 py-4">
              <p className="flex gap-5">
                <Button className="my-auto size-[50px] rounded-full bg-green-200 hover:bg-green-300">
                  <Mail className="text-green-800" size={45} />
                </Button>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    {t("email_title")}
                  </span>
                  <span className="">{t("email")}</span>
                </div>
              </p>
            </div>
            <div className=" rounded-lg bg-white px-6 py-4">
              <p className="flex gap-5">
                <Button className="my-auto size-[50px] rounded-full bg-green-200 hover:bg-green-300">
                  <MapPin className="text-green-800" size={45} />
                </Button>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    {t("address_title")}
                  </span>
                  <span className="">{t("address")}</span>
                </div>
              </p>
            </div>
          </div>

          {/* Get in Touch Form */}
          <div id="contactForm">
            <h2 className="mb-4 text-2xl font-semibold">
              {t("get_in_touch_title")}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700"
                >
                  {t("name_label")}
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder={t("name_placeholder")}
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700"
                >
                  {t("email_label")}
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder={t("email_placeholder")}
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="block text-lg font-medium text-gray-700"
                >
                  {t("message_label")}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData?.message}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder={t("message_placeholder")}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="ml-auto rounded-md bg-green-700 px-4 py-2 text-white transition duration-300 hover:bg-green-500"
                >
                  {t("submit_button")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
