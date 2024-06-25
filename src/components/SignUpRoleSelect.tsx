"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleEnum } from "@/types";

type Props = {
  role: RoleEnum.CUSTOMER | RoleEnum.MANAGER;
  setRole: (role: RoleEnum.CUSTOMER | RoleEnum.MANAGER) => void;
};
const SignUpRoleSelect = ({ role, setRole }: Props) => {
  return (
    <div>
      <Select
        defaultValue={role === RoleEnum.CUSTOMER ? "Customer" : "Manager"}
        onValueChange={(value) => {
          setRole(value as RoleEnum.CUSTOMER | RoleEnum.MANAGER);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RoleEnum.CUSTOMER}>Customer</SelectItem>
          <SelectItem value={RoleEnum.MANAGER}>Manager</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SignUpRoleSelect;
