import { useContext, useEffect, useState } from 'react';

import Identicon from '@/components/Wallet/Identicon';
import { Web3Context } from '@/state/context/web3ContextProvider';

declare let window: any;

const ConnectWallet = ({ handleOpenModal, DrawerMenu }: any) => {
  const {
    state: { userAddress },
    connectWallet,
    automaticWalletConnect,
  } = useContext(Web3Context);
  // const [userAddressFormatted, setUserAddressFormatted] = useState<string>('');
  // const etherBalance = 0;
  const [chainId, setChainid] = useState<any>();

  useEffect(() => {
    automaticWalletConnect();
  }, []);

  useEffect(() => {
    // setUserAddressFormatted(formatAddress(userAddress));
    setChainid(window?.ethereum?.networkVersion);
  }, [userAddress, chainId]);

  /* return (
    <>
      {userAddress !== "" ? (
        <h1 className="self-center mr-4">{userAddressFormatted}</h1>
      ) : (
        <Button className="mr-4" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  ); */
  return userAddress ? (
    <div className="flex items-center justify-center rounded-xl bg-slate-200 p-1 px-3 dark:bg-navy-900  dark:text-gray-700">
      {/* <div className="px-3">
        <span className="text-white text-md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)}{' '}
          {getCurrencyByChainId(
            chainId || parseInt(chainId, 10) || 5001
          )}
        </span>
          </div> */}
      <button onClick={handleOpenModal}>
        <a
          id="connect-wallet"
          className="border-1px h-38 m-1 rounded-xl border-transparent bg-slate-300 px-3 text-slate-700 hover:border hover:border-solid hover:border-slate-300 hover:bg-white dark:bg-navy-800 dark:text-gray-700"
        >
          <span className="text-md font-semibold text-slate-800 dark:text-white">
            {userAddress &&
              `${userAddress.slice(0, 6)}...${userAddress.slice(
                userAddress.length - 4,
                userAddress.length
              )}`}
          </span>
        </a>
      </button>
      <DrawerMenu className="rounded-fulltext-sm flex max-w-xs items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open user menu</span>
        <span className="h-8 w-8 rounded-full">
          <Identicon accountId={userAddress} iconSize={32} />
        </span>
      </DrawerMenu>
    </div>
  ) : (
    <a
      href="#connect-button"
      className="rounded-md bg-gray-900 p-1 py-2 px-3 text-sm font-medium text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      onClick={connectWallet}
    >
      Connect Wallet
    </a>
  );
};

export default ConnectWallet;
