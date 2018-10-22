pragma solidity^0.4.17;

contract Inbox {
    address public owner;
    string public message;

    constructor(string initialMessage) public {
        owner = msg.sender;
        message = initialMessage;
    }
    
    function setMessage(string newMessage) public {
        message = newMessage;
    }
}