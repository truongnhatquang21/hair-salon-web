type StaffId = string;
type AvailableTime = string;

type ICourt = {
  branch_id: string;
  name: string;
  type: string;
  price: string;
  description: string;
  images: string[];
  staff_id: StaffId[];
  available_times: AvailableTime[];
  status: string;
  address: string;
  id: string;
};

export default ICourt;
