import type { ethers } from 'ethers';

export interface IInitialReducerWeb3State {
  provider: ethers.providers.Web3Provider;
  userAddress: string;
  isLoading: boolean;
}
