//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeACoffe {
    //event to be emit when memo is created
    event NewMemo(address from, uint timestamp, string name, string message);
    //struct structure of this event
    struct Memo {
        address from;
        uint timestamp;
        string name;
        string message;
    }
    //list of all memo received from friends
    Memo[] memo;

    //address of contract deployer and mark as payable because
    //it will receive ethers
    address payable owner;
    // run only once when the contract is deploy
    contructor (){

    }
}
