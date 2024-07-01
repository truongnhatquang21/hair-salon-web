"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "../ui/button";

const emailSchema = z.string().email({ message: "Invalid email address!" });
const NewsletterSignUp = () => {
  const t = useTranslations("NewsLetterSignUp");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleButtonClick = () => {
    try {
      emailSchema.parse(email);
      console.log(email);
      setError("");
      toast({
        description: "Email successfully submitted!",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err?.errors[0]?.message ?? "");
        console.log(error);
        toast({
          description: error,
        });
      }
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-2 rounded-3xl bg-teal-500 p-16 text-white">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{t("sign_up_form")}</h2>
          <p>{t("sign_up_form_description")}</p>
        </div>
        <div>
          <h4 className="mb-5 font-bold">{t("sign_up_form_title")}</h4>
          <div className="flex items-center rounded-full bg-white p-3">
            <input
              type="email"
              placeholder="Email Address"
              className=" border-0 p-2 text-gray-700 outline-0 focus-within:ring-0"
              value={email}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              className="h-10 rounded-full bg-teal-700 text-white hover:bg-teal-600 focus:bg-teal-800 focus:ring focus:ring-teal-300"
              onClick={handleButtonClick}
            >
              {t("sign_up_form_button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignUp;
