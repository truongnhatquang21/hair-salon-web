import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentStatus: string;
  onStatusChange: (status: string) => void;
};

const statuses = ["All", "Pending", "Booked", "Cancelled", "Done"];

const StatusFilter: React.FC<Props> = ({ currentStatus, onStatusChange }) => {
  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value)}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
