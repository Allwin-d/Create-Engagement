type Input = {
  label?: string;
  name?: string | undefined;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

const InputField = (props: Input) => {
  const {
    label,
    placeholder,
    type,
    name,
    value,
    onChange,
    required,
    className,
  } = props;

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label htmlFor="" className=" font-medium text-xl">
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className={`px-3 py-2 border rounded-md outline-none focus:ring-2 ring-blue-500 ${className}`}
      ></input>
    </div>
  );
};
export default InputField;
