import Dropdown, { Group, Option } from 'react-dropdown';

import 'react-dropdown/style.css';

const Select = ({
  className,
  options,
  onChange,
  value,
  placeholder,
}: {
  className?: string;
  options: (Group | Option | string)[];
  onChange?: (arg: Option) => void;
  value?: Option | string;
  placeholder?: string;
}) => (
  <Dropdown
    className={className}
    options={options}
    onChange={onChange}
    value={value}
    placeholder={placeholder}
  />
);

export default Select;
