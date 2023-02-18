import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import type { ERC20TestToken, MultiSigWallet } from '../typechain';

describe('MultiSigWallet', function () {
  const required = 3;
  let contractMultiSigWallet: MultiSigWallet;
  const adminAddresses: string[] = [];
  let signers: SignerWithAddress[];
  let contractERC20TestToken: ERC20TestToken;

  before(async () => {
    signers = await ethers.getSigners();
    adminAddresses.push(signers[0].address);
    adminAddresses.push(signers[1].address);
    adminAddresses.push(signers[2].address);

    const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet');
    contractMultiSigWallet = await MultiSigWallet.deploy(
      adminAddresses,
      required
    );
    await contractMultiSigWallet.deployed();

    const ERC20TestToken = await ethers.getContractFactory('ERC20TestToken');
    contractERC20TestToken = await ERC20TestToken.deploy(
      'TestToken',
      'TST',
      100
    );

    await contractERC20TestToken.deployed();
  });

  it('should deposit ERC20 token to wallet', async function () {
    // approve the tokens to the contract
    await contractERC20TestToken.approve(contractMultiSigWallet.address, 100);
    await contractMultiSigWallet.depositERC20ToWallet(
      contractERC20TestToken.address,
      10
    );
    expect(
      await contractERC20TestToken.balanceOf(contractMultiSigWallet.address)
    ).to.be.equal(10);
  });

  it('should create a ERC20 transaction request', async function () {
    const transaction =
      await contractMultiSigWallet.createTransactionRequestForERC20(
        signers[4].address,
        10,
        contractERC20TestToken.address
      );

    await transaction.wait();

    expect(
      (await contractMultiSigWallet.getAllTransactions()).length
    ).to.be.equal(1);
  });

  it('should execute an ERC20 transaction', async function () {
    const contractMultiSigWallet1 = contractMultiSigWallet.connect(signers[1]);
    const contractMultiSigWallet2 = contractMultiSigWallet.connect(signers[2]);
    await contractMultiSigWallet.approveTransactionRequest(0);
    await contractMultiSigWallet1.approveTransactionRequest(0);
    await contractMultiSigWallet2.approveTransactionRequest(0);

    await contractMultiSigWallet.executeTransaction(0);
    expect((await contractMultiSigWallet.transactions(0)).executed).to.be.true;
  });
});
