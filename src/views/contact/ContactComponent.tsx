"use client";

import { Mail, MapPin, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "Contact",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function ContactComponent({ formData, onChange, onSubmit }) {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/sendEmail", formData);
      console.log("Email sent:", response.data);
      // Optionally show a success message or clear the form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error: show an error message to the user
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              {t("contact_information_title")}
            </h2>
            <p className="mb-4 flex gap-2 text-lg">
              <MapPin />
              {t("address")}
            </p>
            <p className="mb-4 flex gap-2 text-lg">
              <PhoneCall />
              {t("phone_number")}
            </p>
            <p className="mb-4 flex gap-2 text-lg">
              <Mail />
              {t("email")}
            </p>
          </div>

          {/* Get in Touch Form */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              {t("get_in_touch_title")}
            </h2>
            <form className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700"
                >
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder="Name"
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="block text-lg font-medium text-gray-700"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md px-3 py-2 shadow-sm sm:text-lg"
                  placeholder="Message"
                />
              </div>
              <div className="flex w-full justify-end ">
                <Button
                  type="submit"
                  className="ml-auto rounded-md bg-green-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
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
