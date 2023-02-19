import type { Contract } from 'ethers';
import { useContext, useReducer } from 'react';

import type { ITransactionRequest } from '@/lib/TransactionRequestBitdao';
/* eslint-disable import/no-cycle */
import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';
import type { MultiSigWallet } from '@/typechain/MultiSigWallet';

interface IInitialReducerWalletState {
  admins: string[];
  error: string;
  transactionRequests: ITransactionRequest[];
}
const initialState: IInitialReducerWalletState = {
  admins: [],
  error: '',
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
    case 'ADD_ADMINS':
      return { ...state, admins: action.payload };
    case 'ADD_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
export const useAdmins = () => {
  const {
    state: { userAddress },
  } = useContext(Web3Context);
  const { state } = useContext(WalletContext);

  const [stateAdmins, dispatch] = useReducer(walletReducer, initialState);

  const getAllAdminsForWallet = async (wallet: Contract & MultiSigWallet) => {
    try {
      const admins = await wallet.getAllAdmins();
      dispatch({ type: 'ADD_ADMINS', payload: admins });
      dispatch({ type: 'ADD_ERROR', payload: '' });

      if (!(await state.selectedWallet.isAdmin(userAddress))) {
        dispatch({
          type: 'ADD_ERROR',
          payload: 'You seem to be not an admin for this wallet!',
        });
      }
    } catch (error) {
      dispatch({ type: 'ADD_ADMINS', payload: [] });
      dispatch({
        type: 'ADD_ERROR',
        payload: 'this wallet does not exist',
      });
    }
  };

  return {
    stateAdmins,
    getAllAdminsForWallet,
  };
};
