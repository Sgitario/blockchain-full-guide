const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const Inbox = require('../build/Inbox.json');

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(Inbox.interface))
        .deploy({ data: Inbox.bytecode, arguments: [ 'Hello world!'] })
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider)
});

describe('Inbox', () => {
    it ('deploys a contract', () => {
        // To operate with the contract, we need the address:
        assert.ok(inbox.options.address);
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello world!');
    });
    it('can change the message', async () => {
        await inbox.methods.setMessage('This is a new message').send({ from: accounts[0], gas: '1000000' });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'This is a new message'); 
    });
});