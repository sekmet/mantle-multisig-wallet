import type { Contract } from 'ethers';

import type { ITransactionRequest } from '@/lib/TransactionRequestBitdao';
import type { MultiSigWallet } from '@/typechain/MultiSigWallet';

export interface IInitialReducerWalletState {
  walletContractsAddresses: string[];
  loading: boolean;
  selectedWallet: Contract & MultiSigWallet;
  transactionRequests: ITransactionRequest[];
}
