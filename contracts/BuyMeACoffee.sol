//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    //event to be emit when memo is created
    //indexed keyword made it easy to search for an address
    event NewMemo(address indexed from, uint timestamp, string name, string message);
    //struct structure of this event
    struct Memo {
        address from;
        uint timestamp;
        string name;
        string message;
    }
    //list of all memo received from friends
    Memo[] memos;

    //address of contract deployer and mark as payable because
    //it will receive ethers
    address payable owner;
    // run only once when the contract is deploy
    contructor (){
      owner = payable(msg.sender);
    }
    /**
     * @dev buy a coffee for a contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
    */
   //memory tell the function param will gabarge after the function execution
   //public anyone should be able to call this function and payable because anyone can send ether to
   //to this function
   function buyCoffee(string memory _name, string memory _message) public payable {
     require(msg.value > 0, "can't buy Coffee with 0 eth");
     //add a memo to storage
     memos.push(Memo(
      msg.sender,
      block.timestamp,
      _name,
      _message,
     ));
     //emit a log event when a new memo is created
     emit NewMemo(
       msg.sender,
       block.timestamp,
       _name,
       _message
     );
   }

   /**
     * @dev send the entire balance in this contract to the owner
    */
   function withdrawTips() public {
    //the money in this contract is stored in address(this).balance
    //owner.send() method send the balance to the original deployer of this function
    require(owner.send(address(this).balance));
   }
   /**
     * @dev retrieve all memo received and stored in a blockchain.
    */
   //view keyword balance it doesn't change anything state variable
   function getMemos() public view returns(Memo[] memory) {
    return memos;
   }
}
