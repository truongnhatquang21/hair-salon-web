import React from "react";

import CheckoutSubcription from "@/views/Subscription/checkout/CheckoutSubcription";

const page = ({ params }: { params: { slug: string } }) => {
  return <CheckoutSubcription subsId={params.slug} />;
};

export default page;
