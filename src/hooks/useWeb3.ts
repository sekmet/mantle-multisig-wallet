import { ethers } from 'ethers';
import { useReducer } from 'react';

interface IInitialReducerWeb3State {
  provider: ethers.providers.Web3Provider;
  userAddress: string;
  isLoading: boolean;
}

const initialState: IInitialReducerWeb3State = {
  provider: {} as ethers.providers.Web3Provider,
  userAddress: '',
  isLoading: true,
};

const web3Reducer = (
  /* eslint-disable @typescript-eslint/default-param-last */
  state = initialState,
  action: { type: string; payload: any }
): IInitialReducerWeb3State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROVIDER':
      return {
        ...state,
        provider: action.payload.provider,
        userAddress: action.payload.userAddress,
      };
    default:
      return state;
  }
};

const getProvider = () => {
  if ((window as any).ethereum) {
    try {
      return new ethers.providers.Web3Provider((window as any).ethereum, 'any');
    } catch (error) {
      console.log(error);
    }
  } else {
    return false;
  }
  return false;
};

export const useWeb3 = () => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  const setUser = (
    provider?: ethers.providers.Web3Provider,
    userAddress?: string
  ) => {
    dispatch({
      type: 'SET_PROVIDER',
      payload: {
        provider,
        userAddress,
      },
    });
  };

  const registerProviderEvents = () => {
    (window as any).ethereum.on('accountsChanged', async () => {
      try {
        setUser(getProvider(), await getProvider().getSigner().getAddress());
      } catch (error) {
        setUser(undefined, '');
      }
    });
    (window as any).ethereum.on('chainChanged', async () => {
      setUser(getProvider(), await getProvider().getSigner().getAddress());
    });
  };

  const automaticWalletConnect = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const provider = getProvider();

    if (!provider) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }

    const accounts = await provider.listAccounts();

    if (accounts.length !== 0) {
      registerProviderEvents();
      setUser(provider, await provider.getSigner().getAddress());
    }
    dispatch({ type: 'SET_LOADING', payload: false });
    return true;
  };

  const connectWallet = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    if ((window as any).ethereum) {
      try {
        const provider = getProvider();
        await provider.send('eth_requestAccounts', []);
        registerProviderEvents();
        setUser(provider, await provider.getSigner().getAddress());
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      alert('Please download Metamask');
    }
  };

  return {
    connectWallet,
    automaticWalletConnect,
    state,
  };
};
