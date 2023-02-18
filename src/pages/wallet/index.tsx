import { CreditCardIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import { useRouteGuard } from '@/hooks/useRouteGuard';
import { Meta } from '@/layouts/Meta';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Main } from '@/templates/Main';

const MyWallets = () => {
  const {
    state: { walletContractsAddresses },
  } = useContext(WalletContext);

  const router = useRouter();

  const openContractHandler = (address: string) => {
    router.push(`/wallet/my/${address}`);
  };

  const createWalletHandler = () => {
    router.push('/wallet/create');
  };

  const importWalletHandler = () => {
    router.push('/wallet/import');
  };

  useRouteGuard();

  return (
    <Main
      meta={
        <Meta
          title="Multisig wallets for BitDAO"
          description="Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721 transactions"
        />
      }
    >
      {/* <div className="p-4 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">My Wallets</h1>
        <ul>
          {walletContractsAddresses?.map((contract) => {
            return (
              <li
                className="dark:bg-dark-secondary bg-light-secondary m-4 rounded p-4 cursor-pointer"
                key={contract}
                onClick={() => openContractHandler(contract)}
              >
                <button>{contract}</button>
              </li>
            );
          })}
        </ul>
        </div> */}

      <div>
        <div className="mt-1 flex flex-col items-center justify-between space-y-2 text-center sm:flex-row sm:space-y-0 sm:text-left">
          <div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-navy-100">
              My Wallets
            </h3>
            <p className="mt-1 hidden sm:block">My multisig wallets</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-navy-100">
              Create or Import a wallet
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => createWalletHandler()}
                className="btn h-10 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                Create
              </button>
              <button
                onClick={() => importWalletHandler()}
                className="btn h-10 w-full bg-info font-medium text-white hover:bg-info-focus focus:bg-info-focus active:bg-info-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
              >
                Import
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {walletContractsAddresses?.map((contract) => {
              return (
                <div key={contract} className="card justify-between p-4 sm:p-5">
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon
                      className="h-10 w-10 shrink-0 rounded-lg"
                      aria-hidden="true"
                    />
                    <div>
                      <button onClick={() => openContractHandler(contract)}>
                        <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                          {contract &&
                            `${contract.slice(0, 21)}...${contract.slice(
                              contract.length - 4,
                              contract.length
                            )}`}
                        </h3>
                      </button>
                      <p className="text-xs font-medium text-slate-700 dark:text-navy-100">
                        <a
                          target="_blank"
                          href={`https://explorer.testnet.mantle.xyz/address/${contract}`}
                          rel="noreferrer"
                        >
                          View wallet in the explorer
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="badge mt-2 bg-primary/10 text-primary dark:bg-accent-light/15 dark:text-accent-light">
                      3 Admins
                    </div>
                    <div className="mt-3 flex items-center justify-between space-x-2">
                      <div className="flex -space-x-3">
                        <div className="avatar h-8 w-8 hover:z-10">
                          <div className="is-initial rounded-full bg-info text-xs+ uppercase text-white ring ring-white dark:ring-navy-700">
                            sx
                          </div>{' '}
                        </div>
                        <div className="avatar h-8 w-8 hover:z-10">
                          <div className="is-initial rounded-full bg-info text-xs+ uppercase text-white ring ring-white dark:ring-navy-700">
                            qa
                          </div>
                        </div>
                        <div className="avatar h-8 w-8 hover:z-10">
                          <div className="is-initial rounded-full bg-info text-xs+ uppercase text-white ring ring-white dark:ring-navy-700">
                            er
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openContractHandler(contract)}
                        className="btn h-8 w-8 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 rotate-45"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default MyWallets;
