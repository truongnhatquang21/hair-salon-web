type IBranch = {
  id: string;
  name: string;
  address: string;
  manager_id: string;
  phone: string;
  images: Array<string>;
  license: Array<string>;
  total_court: number;
  status: string;
  logo: string;
  description: string;
  availableTime: string;
};
export default IBranch;
