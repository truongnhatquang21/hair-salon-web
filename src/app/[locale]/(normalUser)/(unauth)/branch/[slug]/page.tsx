/* eslint-disable no-underscore-dangle */

import { BookingDataStoreProvider } from "@/stores/bookingStore";
import BranchDetailCustomer from "@/views/bookings/BranchDetailCustomer";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  return (
    <BookingDataStoreProvider>
      <BranchDetailCustomer slug={slug} />
    </BookingDataStoreProvider>
  );
};

export default Page;
