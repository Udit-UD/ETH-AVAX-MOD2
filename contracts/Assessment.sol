// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    struct Transaction {
        address sender;
        uint amount;
        uint256 timeStamp;
    }

    Transaction[] public eventHistory;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        eventHistory.push(Transaction(msg.sender, _amount, block.timestamp));

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));
        eventHistory.push(Transaction(msg.sender, _withdrawAmount, block.timestamp));


        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function getOwner() public pure returns(string memory){
        string memory ownerName = "Udit Gupta";
        return ownerName;
    }


    function getOwnerAddress() public view returns(address) {
        return owner;
    }

    function getEventHistoryLength() public view returns (uint256) {
        return eventHistory.length;
    }

    
    function getTransaction(uint256 index) public view returns (address, uint256, uint256) {
        require(index < eventHistory.length, "Invalid index");

        Transaction memory transaction = eventHistory[index];
        return (transaction.sender, transaction.amount, transaction.timeStamp);
    }
    
    function getAllTransactions() public view returns (Transaction[] memory) {
        return eventHistory;
    }

   

}

