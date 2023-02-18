import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';

export const useEtherWallet = () => {
  const {
    isDoneSettingSelectedWallet,
    getAllTransactions,
    state: { selectedWallet },
  } = useContext(WalletContext);

  const [etherValue, setEtherValue] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const {
    state: { provider },
  } = useContext(Web3Context);

  const getWalletValueEther = async (address: string) => {
    const value = await provider.getBalance(address);

    setEtherValue(ethers.utils.formatEther(value.toString()));
  };

  useEffect(() => {
    if (isDoneSettingSelectedWallet()) {
      getWalletValueEther(selectedWallet.address);
    }
  }, [selectedWallet]);

  const depositEtherToSelectedWallet = async (value: string) => {
    try {
      setShowSpinner(true);
      const tx = await selectedWallet.depositToWallet({
        value: ethers.utils.parseEther(value),
      });
      await tx.wait();

      await getWalletValueEther(selectedWallet.address);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const createTransactionRequestEther = async (
    to: string,
    value: string,
    data: []
  ) => {
    try {
      setShowSpinner(true);
      const tx = await selectedWallet.createTransactionRequest(
        to,
        ethers.utils.parseEther(value),
        data
      );

      await tx.wait();

      await getAllTransactions(selectedWallet);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  return {
    depositEtherToSelectedWallet,
    createTransactionRequestEther,
    etherValue,
    showSpinner,
  };
};
