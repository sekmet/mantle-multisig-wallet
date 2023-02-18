import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import type { MultiSigWallet } from '../typechain';

describe('MultiSigWallet', function () {
  const required = 3;
  let contractMultiSigWallet: MultiSigWallet;
  const adminAddresses: string[] = [];
  let signers: SignerWithAddress[];

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
  });

  it('should add users as admins', async function () {
    expect((await contractMultiSigWallet.getAllAdmins()).length).to.equal(
      adminAddresses.length
    );
  });

  it('should return true for the first admin', async function () {
    expect(await contractMultiSigWallet.isAdmin(adminAddresses[0])).to.equal(
      true
    );
  });

  it('should deposit ether to wallet', async function () {
    await contractMultiSigWallet.depositToWallet({
      value: ethers.utils.parseEther('10'),
    });
    expect(
      await ethers.provider.getBalance(contractMultiSigWallet.address)
    ).to.equal(ethers.utils.parseEther('10'));
  });

  it('should create a transaction request', async function () {
    const toAddress = signers[4].address;
    const value = ethers.utils.parseEther('10');
    const data = [0];
    const contractTransaction =
      await contractMultiSigWallet.createTransactionRequest(
        toAddress,
        value,
        data
      );

    await contractTransaction.wait();

    expect(
      (await contractMultiSigWallet.getAllTransactions()).length
    ).to.be.equal(1);
  });

  it('should not create a transaction request', async function () {
    const toAddress = signers[4].address;
    const value = 1;
    const data = [0];

    const newContractMultiSigWallet = contractMultiSigWallet.connect(
      signers[4]
    );

    await expect(
      newContractMultiSigWallet.createTransactionRequest(
        toAddress,
        value,
        data,
        {
          from: signers[4].address,
        }
      )
    ).to.be.revertedWith('address is not an admin');
  });

  it('should approve a transaction request', async function () {
    await contractMultiSigWallet.approveTransactionRequest(0);

    expect(await contractMultiSigWallet.approved(0, signers[0].address)).to.be
      .true;
  });

  it('should not execute a transaction because not enough admins have approved', async function () {
    await expect(
      contractMultiSigWallet.executeTransaction(0)
    ).to.be.revertedWith('not enough admins have approved this transaction');
  });

  it('should execute a transaction', async function () {
    const contractMultiSigWallet1 = contractMultiSigWallet.connect(signers[1]);
    const contractMultiSigWallet2 = contractMultiSigWallet.connect(signers[2]);
    await contractMultiSigWallet1.approveTransactionRequest(0);
    await contractMultiSigWallet2.approveTransactionRequest(0);

    await contractMultiSigWallet.executeTransaction(0);
    expect((await contractMultiSigWallet.transactions(0)).executed).to.be.true;
  });
});
