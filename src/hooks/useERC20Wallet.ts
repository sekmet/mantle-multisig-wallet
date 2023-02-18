import { ethers } from 'ethers';
import { useContext, useState } from 'react';

import ERC20ABI from '@/lib/abis/erc20';
import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';

export const useERC20Wallet = () => {
  const {
    getAllTransactions,
    state: { selectedWallet },
  } = useContext(WalletContext);

  const {
    state: { provider },
  } = useContext(Web3Context);

  const [showSpinner, setShowSpinner] = useState(false);
  const [tokenValue, setTokenValue] = useState('');
  const [tokenName, setTokenName] = useState('');

  const getTokenContract = (tokenAddress: string) => {
    return new ethers.Contract(tokenAddress, ERC20ABI, provider.getSigner());
  };

  const getTokenName = async (tokenAddress: string) => {
    try {
      const tokenContract = getTokenContract(tokenAddress);
      const name = await tokenContract.symbol();
      setTokenName(name);
    } catch (error) {
      console.log(error);
    }
  };

  const getWalletValueERC20 = async (tokenAddress: string) => {
    try {
      const tokenContract = getTokenContract(tokenAddress);
      const decimals = await tokenContract.decimals();

      const value = ethers.utils.formatUnits(
        await tokenContract.balanceOf(selectedWallet.address),
        decimals
      );

      setTokenValue(value.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const depositERC20ToSelectedWallet = async (
    tokenAddress: string,
    value: string
  ) => {
    try {
      setShowSpinner(true);
      const tokenContract = getTokenContract(tokenAddress);
      const decimals = await tokenContract.decimals();

      const valueFormatted = ethers.utils.parseUnits(value, decimals);

      const tx1 = await tokenContract.approve(
        selectedWallet.address,
        valueFormatted,
        { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
      );
      //
      const approve = await tx1.wait();

      if (approve?.transactionHash) {
        const tx2 = await selectedWallet.depositERC20ToWallet(
          tokenAddress,
          valueFormatted,
          { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
        );
        //
        await tx2.wait();
      }

      await getWalletValueERC20(tokenAddress);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const createTransactionRequestERC20 = async (
    to: string,
    value: string,
    tokenAddress: string
  ) => {
    try {
      setShowSpinner(true);
      const valueFormatted = ethers.utils.parseEther(value);

      const tx = await selectedWallet.createTransactionRequestForERC20(
        to,
        valueFormatted,
        tokenAddress,
        { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
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
    depositERC20ToSelectedWallet,
    getWalletValueERC20,
    showSpinner,
    tokenName,
    tokenValue,
    getTokenName,
    createTransactionRequestERC20,
  };
};
