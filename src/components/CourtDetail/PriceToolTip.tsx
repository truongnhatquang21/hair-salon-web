import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PriceTooltipProps = {
  price: string;
  specialPrice: string;
  weekendPrice: string;
};
export function PriceTooltip({
  price,
  specialPrice,
  weekendPrice,
}: PriceTooltipProps) {
  const t = useTranslations("CourtDetail");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={18} className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t("normalPrice")}: {price}/slot
          </p>
          <p>
            {t("specialPrice")}: {specialPrice}/slot
          </p>
          <p>
            {t("weekendPrice")}: {weekendPrice}/slot
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
