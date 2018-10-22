pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether, "Must have at least 0.01 ether");
        
        players.push(msg.sender);
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    function getPlayers() public restricted view returns (address[]) {
        return players;
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    modifier restricted() {
        require(manager == msg.sender, "Only Manager can pick the winner");
        _;
    }
}