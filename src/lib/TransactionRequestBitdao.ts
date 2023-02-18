import type { BigNumber } from 'ethers';

export interface ITransactionRequest {
  id: BigNumber;
  data: string;
  erc20Token: string;
  erc721Token: string;
  executed: boolean;
  requester: string;
  to: string;
  value: BigNumber;
  approved: string;
  required: string;
}
