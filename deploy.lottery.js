const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const Lottery = require('build/Lottery.json');

const provider = new HDWalletProvider(
    'inhale require dry moment bubble deposit seed embark flock opinion fragile just', // mnemonic account
    'https://rinkeby.infura.io/v3/58f26bf5af6a4a97b6d5daa81b044266'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]); // we'll use the first account we have in the mnemonic account.

    const result = await new web3.eth.Contract(JSON.parse(Lottery.interface))
        .deploy({ data: '0x' + Lottery.bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract interface: ' + interface);
    console.log('Contract deployed to', result.options.address); // we need the address to work with this contract!
};

deploy();