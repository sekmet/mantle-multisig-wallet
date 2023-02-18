import { useContext, useEffect } from 'react';

import Identicon from '@/components/Wallet/Identicon';
import { useAdmins } from '@/hooks/useAdmins';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';

const AdminList = () => {
  const { stateAdmins, getAllAdminsForWallet } = useAdmins();
  const {
    state: { selectedWallet },
  } = useContext(WalletContext);

  const {
    state: { userAddress, provider },
  } = useContext(Web3Context);

  useEffect(() => {
    if (selectedWallet?.address) {
      getAllAdminsForWallet(selectedWallet);
    }
  }, [selectedWallet?.address, userAddress, provider]);

  return (
    <div>
      {stateAdmins.error}
      <p className="font-semibold text-slate-800 dark:text-indigo-100">
        Wallet Administrators
      </p>
      <div className="mt-3 flex space-x-2">
        {stateAdmins.admins.map((admin) => (
          <div className="avatar h-6 w-6 hover:z-10" key={admin}>
            <div className="is-initial rounded-full pt-1 ring ring-white dark:ring-navy-700">
              <a
                target="_blank"
                href={`https://explorer.testnet.mantle.xyz/address/${admin}`}
                rel="noreferrer"
              >
                <Identicon accountId={admin} iconSize={24} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
