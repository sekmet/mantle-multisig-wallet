import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-abi-exporter';
import 'solidity-coverage';

import * as dotenv from 'dotenv';
import type { HardhatUserConfig } from 'hardhat/config';
import { task } from 'hardhat/config';

dotenv.config();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: '0.8.16',
  networks: {
    mantletestnet: {
      chainId: 5001,
      url: 'https://rpc.testnet.mantle.xyz',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      saveDeployments: true,
      initialBaseFeePerGas: 0,
      blockGasLimit: 15000000,
      gas: 15000000,
    },
  },
  gasReporter: {
    enabled: process.env.gasReporter !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.coinmarketcapkey || '',
  },
  abiExporter: [
    {
      path: './build',
      format: 'json',
      clear: true,
      flat: true,
    },
  ],
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
