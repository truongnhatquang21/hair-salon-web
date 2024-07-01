// src/components/Home/SearchCourtAddress.tsx

import { AutoComplete } from "../ui/autocomplete";
import { Input } from "../ui/input";

export type Option = {
  value: string;
  label: string;
};

type SearchCourtAddressProps = {
  value: string;
  onChange?: (value: Option | null) => void;
};



const SearchCourtAddress = ({ value, onChange }: SearchCourtAddressProps) => {
  return (
    // <AutoComplete
    //   emptyMessage="No results."
    //   placeholder="Search court address, name..."
    //   onValueChange={onChange}
    //   value={value}
    // />
    
  );
};

export default SearchCourtAddress;
