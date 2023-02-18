//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract MultiSigWallet is IERC721Receiver {
    modifier adminOnly() {
        require(isAdmin[msg.sender] == true, "address is not an admin");
        _;
    }

    modifier validTransactionId(uint256 transactionId) {
        require(
            transactionId < transactions.length,
            "not a valid transactionid"
        );
        _;
    }

    modifier validApproval(uint256 transactionId) {
        require(
            getApprovalCountFromTransaction(transactionId) >= required,
            "not enough admins have approved this transaction"
        );
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(
            !transactions[transactionId].executed,
            "transaction is already executed"
        );
        _;
    }
    event Deposit(address indexed from, uint256 value);
    event DepositERC20(address indexed from, address token, uint256 amount);
    event DepositERC721(address indexed from, address token, uint256 tokenId);
    event Request(address indexed requester, uint256 indexed transactionId);
    event RequestERC20(
        address indexed requester,
        uint256 indexed transactionId
    );
    event RequestERC721(
        address indexed requester,
        uint256 indexed transactionId
    );
    event Approve(address indexed approver, uint256 indexed transactionId);
    event Execute(address indexed executor, uint256 indexed transactionId);

    struct Transaction {
        uint256 id;
        address requester;
        address to;
        uint256 value;
        bytes data;
        address erc20Token;
        address erc721Token;
        bool executed;
    }

    /// @dev transactionId => (admin => idApproved)
    mapping(uint256 => mapping(address => bool)) public approved;
    mapping(address => bool) public isAdmin;

    Transaction[] public transactions;
    address[] public admins;
    uint256 public required;

    /// @param _admins addresses that can sign / approve / request / execute a transaction
    /// @param _required how many admins have to approve a transaction before it can be executed
    constructor(address[] memory _admins, uint256 _required) {
        required = _required;

        require(_admins.length > 0, "add more admins");
        require(_admins.length >= required, "admins > required");

        for (uint256 i = 0; i < _admins.length; i++) {
            isAdmin[_admins[i]] = true;
            admins.push(_admins[i]);
        }
    }

    /// @dev this will get executed when an ERC721 token is transfered to the contract
    /// @dev is from the IERC721Receiver contract
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        operator;
        from;
        tokenId;
        data;
        return this.onERC721Received.selector;
    }

    /// @notice only for ether deposits to this contract
    function depositToWallet() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /// @dev the approve() function has to be called first
    /// @dev used only for ERC20 tokens
    /// @param _token address of the ERC721 token
    /// @param _amount how much we want to deposit to this contract
    function depositERC20ToWallet(address _token, uint256 _amount) external {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        emit DepositERC20(msg.sender, _token, _amount);
    }

    /// @dev the approve() function has to be called first
    /// @dev used only for ERC721 tokens, will call the onERC721Received() function if transfered
    /// @param _token address of the ERC721 token
    /// @param _tokenId id of the token we want to deposit to this contract
    function depositERC721ToWallet(address _token, uint256 _tokenId) external {
        IERC721(_token).safeTransferFrom(msg.sender, address(this), _tokenId);
        emit DepositERC721(msg.sender, _token, _tokenId);
    }

    /// @notice creates a new transaction request for ERC721 tokens only
    /// @dev contract has to be funded with an ERC721 token first, sets 'data' to null by default
    /// @param  _tokenId of the ERC721 we want to use, value = _tokenId
    /// @param  _token address of the ERC721 token we want to use
    function createTransactionRequestForERC721(
        address _to,
        uint256 _tokenId,
        address _token
    ) external adminOnly {
        transactions.push(
            Transaction({
                id: transactions.length,
                requester: msg.sender,
                to: _to,
                value: _tokenId,
                data: bytes("0"),
                erc20Token: address(0),
                erc721Token: _token,
                executed: false
            })
        );
        emit RequestERC721(msg.sender, transactions.length - 1);
    }

    /// @notice creates a new transaction request for ERC20 tokens only
    /// @dev contract has to be funded with an ERC20 token first, sets 'data' to null by default
    /// @param  _value amount you want to send
    /// @param  _token address of the ERC20 token we want to use
    function createTransactionRequestForERC20(
        address _to,
        uint256 _value,
        address _token
    ) external adminOnly {
        transactions.push(
            Transaction({
                id: transactions.length,
                requester: msg.sender,
                to: _to,
                value: _value,
                data: bytes("0"),
                erc20Token: _token,
                erc721Token: address(0),
                executed: false
            })
        );

        emit RequestERC20(msg.sender, transactions.length - 1);
    }

    /// @notice creates a new transaction request
    /// @dev contract has to be funded first
    /// @param  _value amount you want to send
    /// @param  _data optional
    function createTransactionRequest(
        address _to,
        uint256 _value,
        bytes memory _data
    ) external adminOnly {
        transactions.push(
            Transaction({
                id: transactions.length,
                requester: msg.sender,
                to: _to,
                value: _value,
                data: _data,
                erc20Token: address(0),
                erc721Token: address(0),
                executed: false
            })
        );

        emit Request(msg.sender, transactions.length - 1);
    }

    /// @notice can be called by an admin and approves a transaction request (can't be revoked)
    /// @dev it does not matter if the transaction contains an ERC20/ ERC721 token
    /// @param _transactionId identifer for the transaction we want to approve
    function approveTransactionRequest(uint256 _transactionId)
        external
        adminOnly
        validTransactionId(_transactionId)
    {
        require(
            !approved[_transactionId][msg.sender],
            "you have already approved this transaction"
        );
        approved[_transactionId][msg.sender] = true;
        emit Approve(msg.sender, _transactionId);
    }

    /// @notice this function will check if the requested transaction is ERC20/ ERC721 / Ether
    /// @dev when using ERC721 tokens the 'value' of the transaction is actually the tokenId
    /// @param _transactionId identifer for the transaction we want to execute
    function executeTransaction(uint256 _transactionId)
        public
        adminOnly
        validTransactionId(_transactionId)
        validApproval(_transactionId)
        notExecuted(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.executed = true;

        if (transaction.erc20Token != address(0)) {
            IERC20(transaction.erc20Token).transfer(
                transaction.to,
                transaction.value
            );
            emit Execute(msg.sender, _transactionId);
        } else if (transaction.erc721Token != address(0)) {
            IERC721(transaction.erc721Token).safeTransferFrom(
                address(this),
                transaction.to,
                transaction.value
            );
            emit Execute(msg.sender, _transactionId);
        } else {
            (bool success, ) = transaction.to.call{value: transaction.value}(
                transaction.data
            );

            require(success, "something went wrong");
            emit Execute(msg.sender, _transactionId);
        }
    }

    function getApprovalCountFromTransaction(uint256 _transactionId)
        public
        view
        returns (uint256 count)
    {
        for (uint256 i = 0; i < admins.length; i++) {
            if (approved[_transactionId][admins[i]] == true) {
                count++;
            }
        }
    }

    function getAllAdmins() external view returns (address[] memory) {
        return admins;
    }

    function getAllTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }
}
