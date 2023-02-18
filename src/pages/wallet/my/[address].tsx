import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import AdminList from '@/components/Wallet/AdminList';
import TokenType from '@/components/Wallet/TokenType';
import TransactionRequests from '@/components/Wallet/TransactionRequestsAll';
import { useEtherWallet } from '@/hooks/useEtherWallet';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { Meta } from '@/layouts/Meta';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';
import { Main } from '@/templates/Main';

const Wallet = () => {
  const router = useRouter();
  const address = router.query.address as string;

  const { setSelectedWallet } = useContext(WalletContext);

  const {
    state: { provider, userAddress },
  } = useContext(Web3Context);

  const [validWallet, setIsValidWallet] = useState(false);

  const { etherValue } = useEtherWallet();

  useRouteGuard();

  useEffect(() => {
    if (address) {
      const validContract = ethers.utils.isAddress(address);
      setIsValidWallet(validContract);
      if (validContract && Object.keys(provider || {})?.length > 1) {
        setSelectedWallet(address);
      }
    }
  }, [address, provider, userAddress]);

  return validWallet ? (
    <Main
      meta={
        <Meta
          title="Multisig wallets for BitDAO"
          description="Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721 transactions"
        />
      }
    >
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="card bg-gradient-to-br from-white to-slate-300 px-4 pb-4 dark:from-navy-500 dark:to-navy-800 sm:px-5">
            <div className="flex items-center justify-between py-3 text-slate-800 dark:text-white">
              <h2 className="text-2xl font-medium tracking-wide">Wallet</h2>
              <div className="inline-flex">
                {/* <button className="btn -mr-1.5 h-8 w-8 rounded-full p-0 hover:bg-white/20 focus:bg-white/20 active:bg-white/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button> */}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              <div>
                <div className="flex w-9/12 items-center space-x-1">
                  <p className="font-medium text-slate-800 line-clamp-1 dark:text-indigo-100">
                    {address}
                  </p>
                  <button className="btn h-5 w-5 shrink-0 rounded-full p-0 text-slate-800 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:text-indigo-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-800 dark:text-indigo-100">
                  {etherValue || '(0.00)'} BIT
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
                <AdminList />
              </div>
            </div>
          </div>

          <TransactionRequests />
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:gap-5 lg:col-span-4 lg:gap-6">
          <TokenType />
        </div>
      </div>
    </Main>
  ) : (
    <Main
      meta={
        <Meta
          title="Multisig wallets for BitDAO"
          description="Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721 transactions"
        />
      }
    >
      {<h1>{address} not a valid wallet address</h1>}
    </Main>
  );
};

export default Wallet;
