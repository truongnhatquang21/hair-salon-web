import clsx from "clsx";

import { Badge } from "@/components/ui/badge";

type CustomTagProps = {
  status: string;
};
const CustomTag = ({ status }: CustomTagProps) => {
  let colorClass: string;

  switch (status) {
    case "Active":
    case "Available":
      colorClass = "bg-green-500 text-white text-center";
      break;
    case "Inactive":
    case "Unavailable":
    case "IN_USE":
      colorClass = "bg-gray-500 text-white text-center";
      break;
    default:
      colorClass = "bg-gray-400 text-white";
      break;
  }

  return (
    <Badge className={clsx("px-2 py-1 text-sm font-medium", colorClass)}>
      {status}
    </Badge>
  );
};

export default CustomTag;
