import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }) => {
  return <div>{children}</div>;
};

export default layout;
