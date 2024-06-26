type IStaffId = string;
type IImages = { id: string; src: string };

type ICourt = {
  branch_id: string;
  branch_name: string;
  branch_address: string;
  branch_images: IImages[];
  name: string;
  type: string;
  price: string;
  description: string;
  images: IImages[];
  staff_id: IStaffId[];
  status: string;
  id: string;
};

export default ICourt;
