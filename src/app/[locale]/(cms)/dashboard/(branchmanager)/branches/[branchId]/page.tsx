import React from "react";

const page = ({ params }: { params: { branchId: String } }) => {
  const { branchId } = params;
  return <div>{branchId}</div>;
};

export default page;
