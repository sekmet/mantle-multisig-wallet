import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/Button';
import type { RootState } from '@/state/store';
import { changeTokenType } from '@/state/store/app/app.store';

const TokenTypeOptions = [
  { name: 'BitDAO' },
  { name: 'ERC20' },
  { name: 'ERC721' },
];

const TokenTypeMenu = () => {
  const selectedTransactionRequestOption = useSelector(
    (state: RootState) => state.appReducer.tokenTypeSelected
  );
  const dispatch = useDispatch();

  const menuButtonClickHandler = (optionName: string) => {
    dispatch(changeTokenType(optionName));
  };

  return (
    <>
      <div className="flex flex-col justify-start">
        <nav className="flex justify-between gap-4">
          {TokenTypeOptions.map((option) => (
            <Button
              key={option.name}
              onClick={() => {
                menuButtonClickHandler(option.name);
              }}
              className={`
          ${
            selectedTransactionRequestOption === option.name
              ? 'bg-accent'
              : '!bg-gray-600 !text-gray-500 dark:!bg-gray-400'
          }
              `}
            >
              {option.name}
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TokenTypeMenu;
