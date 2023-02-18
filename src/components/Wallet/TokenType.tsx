import { useSelector } from 'react-redux';

import type { RootState } from '@/state/store';

import CreateTransactionRequestEthers from './Bitdao/CreateTransactionRequestEthers';
import DepositEther from './Bitdao/DepositEther';
import CreateTransactionRequestERC20 from './ERC20/CreateTransactionRequestERC20';
import DepositERC20 from './ERC20/DepositERC20';
import CreateTransactionRequestERC721 from './ERC721/CreateTransactionRequestERC721';
import DepositERC721 from './ERC721/DepositERC721';
import TokenTypeMenu from './TokenTypeMenu';

const TokenType = () => {
  const selectedTransactionRequestOption = useSelector(
    (state: RootState) => state.appReducer.tokenTypeSelected
  );

  return (
    <div className="mb-10">
      <TokenTypeMenu />
      {selectedTransactionRequestOption === 'BitDAO' && (
        <>
          <div className="card mt-3 px-4 pb-4 sm:px-5">
            <DepositEther />
          </div>
          <div className="card mt-6 px-4 pb-4 sm:px-5">
            <CreateTransactionRequestEthers />
          </div>
        </>
      )}
      {selectedTransactionRequestOption === 'ERC20' && (
        <>
          <div className="card mt-3 px-4 pb-4 sm:px-5">
            <DepositERC20 />
          </div>
          <div className="card mt-6 px-4 pb-4 sm:px-5">
            <CreateTransactionRequestERC20 />
          </div>
        </>
      )}
      {selectedTransactionRequestOption === 'ERC721' && (
        <>
          <div className="card mt-3 px-4 pb-4 sm:px-5">
            <DepositERC721 />
          </div>
          <div className="card mt-6 px-4 pb-4 sm:px-5">
            <CreateTransactionRequestERC721 />
          </div>
        </>
      )}
    </div>
  );
};

export default TokenType;
