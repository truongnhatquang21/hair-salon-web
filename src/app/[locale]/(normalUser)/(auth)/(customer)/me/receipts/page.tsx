import React from "react";

import BookingReceipt from "@/components/CustomerBooking/BookingReceipts";

type Props = {};
const bookingData = [
  {
    _id: "667b9765ade8d64bb6564e86",
    type: "single_schedule",
    paymentType: "haft",
    paymentMethod: "vnpay",
    totalPrice: 12345,
    totalHour: 30,
    startDate: "2024-06-11T00:00:00.000Z",
    endDate: "2024-06-11T00:00:00.000Z",
    status: "Pending",
    court: {
      name: "san cau long abc",
      type: "hehe",
      price: 1233,
      images: [
        "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
        "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
      ],
      description: "123",
      status: "Termination",
      branch: {
        name: "san cau long abcd",
        images: [
          "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
          "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
        ],
      },
    },
  },
  {
    _id: "667b9765ade8d64bb6564e86",
    type: "single_schedule",
    paymentType: "haft",
    paymentMethod: "vnpay",
    totalPrice: 12345,
    totalHour: 30,
    startDate: "2024-06-11T00:00:00.000Z",
    endDate: "2024-06-11T00:00:00.000Z",
    status: "Pending",
    court: {
      name: "san cau long abc",
      type: "hehe",
      price: 1233,
      images: [
        "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
        "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
      ],
      description: "123",
      status: "Termination",
      branch: {
        name: "san cau long abcd",
        images: [
          "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
          "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
        ],
      },
    },
  },
  {
    _id: "667b9765ade8d64bb6564e86",
    type: "single_schedule",
    paymentType: "haft",
    paymentMethod: "vnpay",
    totalPrice: 12345,
    totalHour: 30,
    startDate: "2024-06-11T00:00:00.000Z",
    endDate: "2024-06-11T00:00:00.000Z",
    status: "Pending",
    court: {
      name: "san cau long abc",
      type: "hehe",
      price: 1233,
      images: [
        "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
        "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
      ],
      description: "123",
      status: "Termination",
      branch: {
        name: "san cau long abcd",
        images: [
          "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
          "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
        ],
      },
    },
  },
  {
    _id: "667b9765ade8d64bb6564e86",
    type: "single_schedule",
    paymentType: "haft",
    paymentMethod: "vnpay",
    totalPrice: 12345,
    totalHour: 30,
    startDate: "2024-06-11T00:00:00.000Z",
    endDate: "2024-06-11T00:00:00.000Z",
    status: "Pending",
    court: {
      name: "san cau long abc",
      type: "hehe",
      price: 1233,
      images: [
        "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
        "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
      ],
      description: "123",
      status: "Termination",
      branch: {
        name: "san cau long abcd",
        images: [
          "https://babolat.com.vn/wp-content/uploads/2023/10/san-cau-long-viettel.jpg",
          "https://thethao365.com.vn/Data/upload/images/Product/Caulong/kich-thuoc-san-cau-long.jpg",
        ],
      },
    },
  },
];
const page = (props: Props) => {
  return (
    <div>
      <BookingReceipt bookings={bookingData} />
    </div>
  );
};

export default page;
