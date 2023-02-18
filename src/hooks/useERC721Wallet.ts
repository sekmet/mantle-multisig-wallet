import { ethers } from 'ethers';
import { useContext, useState } from 'react';

import { WalletContext } from '@/state/context/walletContextProvider';
import { Web3Context } from '@/state/context/web3ContextProvider';

const ERC721ABI = [
  'function balanceOf(address _owner) external view returns (uint256)',
  'function ownerOf(uint256 _tokenId) external view returns (address)',
  'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable',
  'function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable',
  'function transferFrom(address _from, address _to, uint256 _tokenId) external payable',
  'function approve(address _approved, uint256 _tokenId) external payable',
  'function setApprovalForAll(address _operator, bool _approved) external',
  'function getApproved(uint256 _tokenId) external view returns (address)',
  'function isApprovedForAll(address _owner, address _operator) external view returns (bool)',
  'function name() external view returns (string)',
];
export const useERC721Wallet = () => {
  const {
    getAllTransactions,
    state: { selectedWallet },
  } = useContext(WalletContext);

  const {
    state: { provider },
  } = useContext(Web3Context);

  const [loading, setLoading] = useState(false);
  const [erc721Name, setErc721Name] = useState('');

  const createTransactionRequestERC721 = async (
    toAddress: string,
    tokenId: string,
    tokenAddress: string
  ) => {
    try {
      setLoading(true);
      const tx = await selectedWallet.createTransactionRequestForERC721(
        toAddress,
        tokenId,
        tokenAddress,
        { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
      );

      await tx.wait();
      await getAllTransactions(selectedWallet);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getERC721Contract = (tokenAddress: string) => {
    return new ethers.Contract(tokenAddress, ERC721ABI, provider.getSigner());
  };

  const getNameOfToken = async (tokenAddress: string) => {
    try {
      const tokenContract = getERC721Contract(tokenAddress);
      const tx = await tokenContract.name();
      setErc721Name(tx);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const depositERC721ToWallet = async (
    tokenAddress: string,
    tokenId: string
  ) => {
    try {
      setLoading(true);
      const erc721Contract = getERC721Contract(tokenAddress);

      const tx1 = await erc721Contract.approve(
        selectedWallet.address,
        tokenId,
        { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
      );
      await tx1.wait();

      const tx2 = await selectedWallet.depositERC721ToWallet(
        erc721Contract.address,
        tokenId,
        { gasPrice: ethers.utils.parseUnits('1', 'wei'), gasLimit: 15000000 }
      );

      await tx2.wait();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTransactionRequestERC721,
    depositERC721ToWallet,
    getNameOfToken,
    erc721Name,
    loading,
  };
};
