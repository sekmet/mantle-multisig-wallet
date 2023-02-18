import type { FC } from 'react';

interface IInput {
  name: string;
  labelName?: string;
  placeholder?: string;
  onChange?: (event) => void;
  value?: string;
  type: string;
  onBlur?: (event) => void;
}

const Input: FC<IInput> = (props) => {
  return (
    <>
      <label className="block text-sm font-bold" htmlFor={props.name}>
        {props.labelName}
      </label>
      <input
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-black shadow focus:outline-none"
        id={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
      ></input>
    </>
  );
};

export default Input;
