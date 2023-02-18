import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import type { ERC721TestToken, MultiSigWallet } from '../typechain';

describe('MultiSigWallet', function () {
  const required = 3;
  let contractMultiSigWallet: MultiSigWallet;
  const adminAddresses: string[] = [];
  let signers: SignerWithAddress[];
  let contractERC721TestToken: ERC721TestToken;

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

    const ERC721TestToken = await ethers.getContractFactory('ERC721TestToken');
    contractERC721TestToken = await ERC721TestToken.deploy('TestToken', 'TST');

    await contractERC721TestToken.deployed();
  });

  it('should deposit ERC721 token to wallet', async () => {
    await contractERC721TestToken.approve(contractMultiSigWallet.address, 1);
    await contractMultiSigWallet.depositERC721ToWallet(
      contractERC721TestToken.address,
      1
    );
    expect(
      await contractERC721TestToken.balanceOf(contractMultiSigWallet.address)
    ).to.be.equal(1);
  });

  it('should create a ERC721 transaction request', async function () {
    const transaction =
      await contractMultiSigWallet.createTransactionRequestForERC721(
        signers[4].address,
        1,
        contractERC721TestToken.address
      );

    await transaction.wait();

    expect(
      (await contractMultiSigWallet.getAllTransactions()).length
    ).to.be.equal(1);
  });

  it('should execute an ERC721 transaction', async function () {
    const contractMultiSigWallet1 = contractMultiSigWallet.connect(signers[1]);
    const contractMultiSigWallet2 = contractMultiSigWallet.connect(signers[2]);
    await contractMultiSigWallet.approveTransactionRequest(0);
    await contractMultiSigWallet1.approveTransactionRequest(0);
    await contractMultiSigWallet2.approveTransactionRequest(0);

    await contractMultiSigWallet.executeTransaction(0);
    expect((await contractMultiSigWallet.transactions(0)).executed).to.be.true;
  });
});
