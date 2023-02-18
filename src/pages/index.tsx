import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Web3Context } from '@/state/context/web3ContextProvider';
import { Main } from '@/templates/Main';

const Index = () => {
  const {
    state: { userAddress },
    connectWallet,
    // automaticWalletConnect,
  } = useContext(Web3Context);
  const router = useRouter();
  const [isMetamask, setIsMetamask] = useState(false);

  const createWalletHandler = () => {
    router.push('/wallet/create');
  };

  const importWalletHandler = () => {
    router.push('/wallet/import');
  };

  useEffect(() => {
    const metamask = (window as any).ethereum;
    if (metamask) setIsMetamask(true);
  }, [isMetamask]);

  return !userAddress ? (
    <Main
      meta={
        <Meta
          title="Multisig wallets for BitDAO"
          description="Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721 transactions"
        />
      }
    >
      <div className="flex flex-col items-center justify-center p-4">
        <a href="#">
          <img
            className="max-w-xs"
            src={`${router.basePath}/assets/images/logo.png`}
            alt="Multisig wallets for BitDAO"
          />
        </a>

        <h1 className="text-2xl font-bold">
          <span role="img" aria-label="zap">
            ⚡️
          </span>{' '}
          Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721
          transactions
        </h1>
        <h3 className="text-1xl font-bold">
          <a href="https://github.com/sekmet/mantle-multisig-wallet">
            Find more information here
          </a>
        </h3>
        {isMetamask ? (
          <>
            <h4 className="mt-5 text-xl font-bold">
              Connect now and get started:
            </h4>
            <a
              href="#connect-button"
              className="rounded-md bg-gray-900 p-1 py-2 px-3 text-lg font-medium text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              onClick={connectWallet}
            >
              Connect Wallet
            </a>
          </>
        ) : (
          <h3 className="mt-5 text-xl font-bold text-red-500">
            Please download and install Metamask to continue.
          </h3>
        )}
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
      <div className="mt-4 mb-6 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            <a href="#">
              <img
                className="sm:max-w-xs"
                src={`${router.basePath}/assets/images/logo.png`}
                alt="Multisig wallets for BitDAO"
              />
            </a>
          </div>
        </div>
        <div className="col-span-12 grid grid-cols-1 gap-4 p-3 sm:gap-5 lg:col-span-9 lg:mt-6 lg:gap-6">
          <h1 className="text-center text-2xl font-bold text-navy-600 dark:text-navy-100 sm:text-left">
            <span role="img" aria-label="zap">
              ⚡️
            </span>{' '}
            Create, import and use Multisig wallets for BitDAO, ERC20 and ERC721
            transactions
          </h1>

          <h3 className="mt-1 text-xl font-bold text-navy-600 dark:text-navy-100">
            🚀 Features:
          </h3>
          <ul className="text-md text-navy-600 dark:text-navy-100">
            <li>
              <span role="img" aria-label="white_check_mark">
                ⚡
              </span>{' '}
              Allow create multisig wallets with multiple admins
            </li>
            <li>
              <span role="img" aria-label="white_check_mark">
                💎
              </span>{' '}
              Allow deposit and send BitDAO(BIT) token
            </li>
            <li>
              <span role="img" aria-label="white_check_mark">
                🪙
              </span>{' '}
              Allow deposit and send ERC20 tokens
            </li>
            <li>
              <span role="img" aria-label="white_check_mark">
                🖼️
              </span>{' '}
              Allow deposit and send ERC721(NFT) tokens
            </li>
          </ul>

          <h3 className="mt-1 text-xl font-bold text-slate-700 dark:text-navy-100">
            <span role="img" aria-label="white_check_mark">
              ✅
            </span>{' '}
            Get started, creating or importing a wallet
          </h3>
          <div>
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
      </div>
    </Main>
  );
};

export default Index;
