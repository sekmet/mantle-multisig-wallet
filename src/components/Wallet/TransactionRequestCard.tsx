import { ethers } from 'ethers';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import Button from '@/components/Button';
import { useERC20Wallet } from '@/hooks/useERC20Wallet';
import { useERC721Wallet } from '@/hooks/useERC721Wallet';
import type { ITransactionRequest } from '@/lib/TransactionRequestBitdao';
import { WalletContext } from '@/state/context/walletContextProvider';
import { formatAddress } from '@/utils/format-address';
import { isToken } from '@/utils/isToken';

const TransactionRequestCard: FC<ITransactionRequest> = ({
  approved,
  executed,
  id,
  requester,
  required,
  to,
  value,
  erc20Token,
  erc721Token,
}) => {
  const { approveTransactionRequest, executeTransactionRequest } =
    useContext(WalletContext);

  const { getTokenName, tokenName } = useERC20Wallet();

  const [transactionType, setTransactionType] = useState('');

  const { getNameOfToken, erc721Name } = useERC721Wallet();

  useEffect(() => {
    if (isToken(erc20Token)) {
      getTokenName(erc20Token);
      setTransactionType('ERC20');
    } else if (isToken(erc721Token)) {
      getNameOfToken(erc721Token);
      setTransactionType('ERC721');
    } else {
      setTransactionType('BIT');
    }
  }, []);

  return (
    <>
      {transactionType === 'ERC20' && (
        <>
          <h1 className="text-center text-2xl font-bold">{transactionType}</h1>
          <h1>
            Token: {formatAddress(erc20Token)} ({tokenName})
          </h1>
          <h1>{`Value: ${ethers.utils.formatEther(
            value.toString()
          )} ${tokenName}`}</h1>
        </>
      )}
      {transactionType === 'BIT' && (
        <>
          <h1 className="text-center text-2xl font-bold">{transactionType}</h1>
          <h1>{`Value ${ethers.utils.formatEther(value.toString())} BIT`}</h1>
        </>
      )}
      {transactionType === 'ERC721' && (
        <>
          <h1 className="text-center text-2xl font-bold">{transactionType}</h1>
          <h1>Token: {formatAddress(erc721Token)}</h1>
          <h1>{`Token id:${value} (${erc721Name})`}</h1>
        </>
      )}
      <h1>Requester: {formatAddress(requester)}</h1>
      <h1>To: {formatAddress(to)}</h1>
      <h1>Executed: {executed.toString()}</h1>
      <h1>Approved: {`${approved} of ${required}`}</h1>
      <div className="mt-5 flex justify-evenly">
        {!executed && (
          <Button
            onClick={async () => {
              await approveTransactionRequest(id.toString());
            }}
          >
            Approve
          </Button>
        )}
        {!executed && approved >= required && (
          <Button
            onClick={async () => {
              await executeTransactionRequest(id.toString());
            }}
          >
            Execute
          </Button>
        )}
      </div>
    </>
  );
};

export default TransactionRequestCard;
