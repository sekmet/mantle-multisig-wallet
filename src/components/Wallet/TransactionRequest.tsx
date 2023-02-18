import { BoltIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ethers } from 'ethers';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import { useERC20Wallet } from '@/hooks/useERC20Wallet';
import { useERC721Wallet } from '@/hooks/useERC721Wallet';
import type { ITransactionRequest } from '@/lib/TransactionRequestBitdao';
import { WalletContext } from '@/state/context/walletContextProvider';
import { formatAddress } from '@/utils/format-address';
import { isToken } from '@/utils/isToken';

const TransactionRequest: FC<ITransactionRequest> = ({
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
      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
        <div className="flex items-center space-x-4">
          {executed ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/10 text-emerald-500 dark:bg-emerald-900/60 dark:text-emerald-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-900/10 text-red-500 dark:bg-red-900/60 dark:text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-slate-700 dark:text-navy-100">
              {formatAddress(requester)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-300">
              {transactionType} Transaction
            </p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
        <p className="font-medium text-slate-700 dark:text-navy-100">
          {formatAddress(to)}
        </p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
        <p className="font-medium text-slate-700 dark:text-navy-100">{`${approved} of ${required}`}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
        {transactionType === 'ERC20' && (
          <>
            <p className="font-semibold text-red-500">
              {`-${ethers.utils.formatEther(value.toString())} ${tokenName}`}
            </p>
          </>
        )}
        {transactionType === 'BIT' && (
          <p className="font-semibold text-red-500">{`-${ethers.utils.formatEther(
            value.toString()
          )} BIT`}</p>
        )}
        {transactionType === 'ERC721' && (
          <p className="font-semibold text-red-500">{`-${value} (${erc721Name})`}</p>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
        {!executed && approved < required && (
          <button
            type="button"
            onClick={async () => {
              await approveTransactionRequest(id.toString());
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <CheckCircleIcon
              className="-ml-0.5 mr-1 h-4 w-4"
              aria-hidden="true"
            />
            Approve
          </button>
        )}
        {!executed && approved >= required && (
          <button
            type="button"
            onClick={async () => {
              await executeTransactionRequest(id.toString());
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-400 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <BoltIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
            Execute
          </button>
        )}
      </td>
    </>
  );
};

export default TransactionRequest;
