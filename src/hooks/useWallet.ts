import type { Contract } from 'ethers';
import { ethers } from 'ethers';
import { useContext, useEffect, useReducer, useState } from 'react';

import walletContractArtifact from '@/artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json';
import type { IInitialReducerWalletState } from '@/lib/IReducerWalletState';
import { Web3Context } from '@/state/context/web3ContextProvider';
import type { MultiSigWallet } from '@/typechain/MultiSigWallet';

/* eslint-disable import/no-cycle */
import { useAdmins } from './useAdmins';

const initialState: IInitialReducerWalletState = {
  walletContractsAddresses: [],
  loading: false,
  selectedWallet: {} as Contract & MultiSigWallet,
  transactionRequests: [],
};

const walletReducer = (
  /* eslint-disable @typescript-eslint/default-param-last */
  state = initialState,
  action: {
    type: string;
    payload: any;
  }
): IInitialReducerWalletState => {
  switch (action.type) {
    case 'ADD_WALLET':
      localStorage.setItem(
        'wallets',
        JSON.stringify([...state.walletContractsAddresses, action.payload])
      );

      return {
        ...state,
        walletContractsAddresses: [
          ...state.walletContractsAddresses,
          action.payload,
        ],
      };
    case 'SET_WALLETS':
      return {
        ...state,
        walletContractsAddresses: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      } as IInitialReducerWalletState;
    case 'SET_SELECTEDWALLET':
      return {
        ...state,
        selectedWallet: action.payload,
      };
    case 'SET_TXREQUESTS':
      return { ...state, transactionRequests: action.payload };
    default:
      return state;
  }
};

export const useWallet = () => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const {
    state: { provider },
  } = useContext(Web3Context);

  const { getAllAdminsForWallet } = useAdmins();

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const contractString = localStorage.getItem('wallets');

    if (!contractString) {
      return;
    }
    const contracts = JSON.parse(localStorage.getItem('wallets') || '');
    dispatch({ type: 'SET_WALLETS', payload: contracts });
  }, []);

  const importMultiSigWalletContract = async (address: string) => {
    dispatch({ type: 'ADD_WALLET', payload: address });
  };

  const getAllTransactions = async (wallet: Contract & MultiSigWallet) => {
    try {
      setShowSpinner(true);
      const transactions = await wallet.getAllTransactions();

      const withApprovedCount = await Promise.all(
        transactions.map(async (tx) => {
          const count = await wallet.getApprovalCountFromTransaction(tx.id);
          return {
            ...tx,
            approved: count.toString(),
            required: (await wallet.required()).toString(),
          };
        })
      );

      dispatch({ type: 'SET_TXREQUESTS', payload: withApprovedCount });
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const setSelectedWallet = async (address: string) => {
    const walletContract = new ethers.Contract(
      address,
      walletContractArtifact.abi,
      provider.getSigner()
    ) as Contract & MultiSigWallet;

    dispatch({ type: 'SET_SELECTEDWALLET', payload: walletContract });

    await getAllTransactions(walletContract);
    await getAllAdminsForWallet(walletContract);
  };

  const createNewWallet = async (admins: string[], required: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const walletContract = new ethers.ContractFactory(
        walletContractArtifact.abi,
        walletContractArtifact.bytecode,
        provider?.getSigner()
      );

      const contract = await walletContract.deploy(admins, required);
      await contract.deployed();
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'ADD_WALLET', payload: contract.address });
      return contract.address;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      console.log(error);
      return '';
    }
  };

  const isDoneSettingSelectedWallet = () => {
    return Object.keys(state.selectedWallet || {}).length > 1;
  };

  const approveTransactionRequest = async (id: string) => {
    try {
      setShowSpinner(true);
      const tx = await state.selectedWallet.approveTransactionRequest(id);
      await tx.wait();

      await getAllTransactions(state.selectedWallet);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const executeTransactionRequest = async (id: string) => {
    try {
      setShowSpinner(true);
      const tx = await state.selectedWallet.executeTransaction(id);
      await tx.wait();
      await getAllTransactions(state.selectedWallet);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  return {
    createNewWallet,
    setSelectedWallet,
    importMultiSigWalletContract,
    isDoneSettingSelectedWallet,
    getAllTransactions,
    approveTransactionRequest,
    executeTransactionRequest,
    showSpinner,
    state,
  };
};
