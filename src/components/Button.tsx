import type { FC, PropsWithChildren } from 'react';

import Spinner from './Spinner';

interface IButton {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: any;
  showSpinner?: boolean;
}

const Button: FC<PropsWithChildren & IButton> = ({
  children,
  onClick,
  className,
  disabled,
  type,
  showSpinner,
}) => {
  return (
    <>
      <button
        className={`flex flex-col items-center justify-center rounded bg-primary py-2 px-4 font-bold text-white ${
          className || ''
        } ${disabled ? 'bg-gray-600' : ''} 
        `}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
        {showSpinner && <Spinner />}
      </button>
    </>
  );
};

export default Button;
