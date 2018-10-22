const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const Lottery = require('../build/Lottery.json');

let accounts;
let lottery;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(Lottery.interface))
        .deploy({ data: Lottery.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    lottery.setProvider(provider)
});

describe('Lottery', () => {
    it ('deploys a contract', () => {
        // To operate with the contract, we need the address:
        assert.ok(lottery.options.address);
    });

    it('allows accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to entery', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (err) {
            assert(true);
        }
        
    });

    it ('only manager can call pikWinner', async() => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(true);
        }
    });

    it('sends money to the winner and resets the player array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]); // money in wei

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        
        const finalBalance = await web3.eth.getBalance(accounts[0]); 

        // Each transaction needs to pay some gas to be processed, so the final balance is not 0.02 ether, but a bit less:
        const difference = finalBalance - initialBalance;
        assert(difference > 0);
    });
});