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
    case "Done":
    case "Manual Entry":
    case "full":
      colorClass = "bg-green-500 text-white text-center hover:bg-green-700";
      break;
    case "permanent_schedule":
    case "Customer":
    case "partial":
    case "Custom":
      colorClass = "bg-violet-500	 text-white text-center hover:bg-violet-700";
      break;
    case "Inactive":
    case "Unavailable":
    case "Cancelled":
    case "Refund":
      colorClass = "bg-gray-500 text-white text-center hover:bg-gray-700";
      break;
    case "Pending":
    case "IN_USE":
    case "Inuse":
    case "Operator":
      colorClass = "bg-yellow-500 text-white text-center hover:bg-yellow-700";
      break;
    case "Booking":
      colorClass = "bg-lime-500 text-white text-center hover:bg-lime-700";
      break;
    case "flexible_schedule":
    case "Admin":
    case "Maintenance needed":
    case "Maintenance":
      colorClass = "bg-orange-500 text-white text-center hover:orange-700";
      break;
    case "Booked":
    case "Manager":
    case "Male":
    case "Package":
    case "Linked Account":
    case "Standard":
      colorClass = "bg-cyan-500 text-white text-center hover:bg-cyan-700";
      break;
    case "Staff":
    case "Add Court":
    case "Warn":
      colorClass = "bg-fuchsia-500 text-white text-center hover:bg-fuchsia-700";
      break;
    case "single_schedule":
      colorClass = "bg-emerald-500 text-white text-center hover:bg-emerald-700";
      break;
    case "Female":
      colorClass = "bg-rose-500 text-white text-center hover:bg-rose-700";
      break;
    case "competition_schedule":
    case "Denied":
      colorClass = "bg-red-500 text-white text-center hover:bg-red-700";
      break;
    case "Termination":
      colorClass = "bg-slate-500 text-white text-center hover:bg-slate-700";
      break;
    default:
      colorClass = "bg-gray-400 text-white hover:bg-gray-600";
      break;
  }
  const formatStatus = (text: string) => {
    // Capitalize the first letter and make the rest lowercase
    if (text) {
      text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

      // Replace underscores (_) or dashes (-) with spaces
      text = text.replace(/[_-]/g, " ");

      return text;
    }
    return "error";
  };
  return (
    <Badge className={clsx("px-2 py-1 text-sm font-medium", colorClass)}>
      {formatStatus(status)}
    </Badge>
  );
};

export default CustomTag;
