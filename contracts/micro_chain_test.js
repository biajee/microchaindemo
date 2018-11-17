const Chain3 = require('chain3');
const fs = require('fs');
const solc = require('solc');

const vnodeUri = 'http://127.0.0.1:8545';
var address = '';
let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(vnodeUri));

if(!chain3.isConnected()){
    throw new Error('unable to connect to moac vnode at ' + vnodeUri);
}else{
    console.log('connected to moac vnode at ' + vnodeUri);
    let coinbase = chain3.mc.coinbase;
    console.log('coinbase:' + coinbase);
    let balance = chain3.mc.getBalance(coinbase);
    console.log('balance:' + balance/1000000000000000000 + " MC");
    let accounts = chain3.mc.accounts;
    console.log(accounts);
    
    address = coinbase;
    if (chain3.personal.unlockAccount(address, 'test', 0)) {
       console.log(`${address} is unlocaked`);
    }else{
       console.log(`unlock failed, ${address}`);
       throw new Error('unlock failed ' + address);
    }
}

//==========================================================================
//==========================================================================
console.log("Deploying the subchainprotocolbaseContract");


var contract = fs.readFileSync('../../../../../contracts/SubChainProtocolBase.sol', 'utf8');

var output = solc.compile(contract, 1);

var abi = output.contracts[':SubChainProtocolBase'].interface;
var bin = output.contracts[':SubChainProtocolBase'].bytecode;



var protocol = "POR";
var bmin = 3;
var subchainprotocolbaseContract = chain3.mc.contract(JSON.parse(abi));
var subchainprotocolbase = subchainprotocolbaseContract.new(
   protocol,
   bmin,
   {
     from: chain3.mc.accounts[0], 
     data: '0x' + bin, 
     gas: '9000000'
   }
 );

console.log("subchainprotocolbaseContract is being deployed transaction: " + subchainprotocolbase.transactionHash);
waitBlock(subchainprotocolbase.transactionHash);
subchainprotocolbase = subchainprotocolbaseContract.at(chain3.mc.getTransactionReceipt(subchainprotocolbase.transactionHash).contractAddress);

//==========================================================================
//==========================================================================
console.log("Deploying the vnodeprotocolbaseContract");



var contract = fs.readFileSync('../../../../../contracts/VnodeProtocolBase.sol', 'utf8');

var output = solc.compile(contract, 1);

var abi = output.contracts[':VnodeProtocolBase'].interface;
var bin = output.contracts[':VnodeProtocolBase'].bytecode;

var bmin = 1;
var vnodeprotocolbaseContract = chain3.mc.contract(JSON.parse(abi));
var vnodeprotocolbase = vnodeprotocolbaseContract.new(
   bmin,
   {
     from: chain3.mc.accounts[0], 
     data: '0x' + bin,
     gas: '4700000'
   }
 );

console.log("vnodeprotocolbaseContract is being deployed transaction: " + vnodeprotocolbase.transactionHash);
waitBlock(vnodeprotocolbase.transactionHash);
vnodeprotocolbase = vnodeprotocolbaseContract.at(chain3.mc.getTransactionReceipt(vnodeprotocolbase.transactionHash).contractAddress);

//==========================================================================
//==========================================================================

console.log("Deploying the subchainbaseContract");

var input = {
  '': fs.readFileSync('../../../../../contracts/SubChainBase.sol', 'utf8'),
  'SubChainProtocolBase.sol': fs.readFileSync('../../../../../contracts/SubChainProtocolBase.sol', 'utf8')
};

var output = solc.compile({sources: input}, 1);



var abi = output.contracts[':SubChainBase'].interface;
var bin = output.contracts[':SubChainBase'].bytecode;

console.log("subchainprotocolbase.address:"+subchainprotocolbase.address);
console.log("vnodeprotocolbase.address:"+vnodeprotocolbase.address);

var proto = subchainprotocolbase.address ;
var vnodeProtocolBaseAddr = vnodeprotocolbase.address ;
var min = 1 ;
var max = 10 ;
var thousandth = 1 ;
var flushRound = 20 ;
var subchainbaseContract = chain3.mc.contract(JSON.parse(abi));
var subchainbase = subchainbaseContract.new(
   proto,
   vnodeProtocolBaseAddr,
   min,
   max,
   thousandth,
   flushRound,
   {
     from: chain3.mc.accounts[0], 
     data: '0x' + bin,
     gas: '9000000'
   }
 );

console.log("subchainbaseContract is being deployed transaction: " + subchainbase.transactionHash);
waitBlock(subchainbase.transactionHash);
subchainbase = subchainbaseContract.at(chain3.mc.getTransactionReceipt(subchainbase.transactionHash).contractAddress);

//==========================================================================
//0xaE6E5aBe58B63Ab7129fF77c6d2c000F5b2F0244
//0x8A6c516367EadB886B36197300DEaaB7BE5867DC
//0xb1fe3ec07271F7Df21871314E05EdB463be05890
//
//==========================================================================
console.log("send mc to scs1, scs2, scs3 and scsm");
scs1="0x3e0025B9fCDC70B7cf63A6c087345aFFE2Df7301";
sendtx(chain3.mc.accounts[0], scs1, 20);
waitBalance(scs1, 20);

scs2="0xb441fc1eBf52474D7B9B61D978bC87484C21bAa4";
sendtx(chain3.mc.accounts[0], scs2, 20);
waitBalance(scs2, 20);

scs3="0xF70ac426BD2AFfFd718D08bAaEA72C08817433d8";
sendtx(chain3.mc.accounts[0], scs3, 20);
waitBalance(scs3, 20);

scsm="0xf3c60706f42C705A1e5E9C47535DF2e0da819bD7";
sendtx(chain3.mc.accounts[0], scsm, 20);
waitBalance(scsm, 20);

// scsm="0x3e0025B9fCDC70B7cf63A6c087345aFFE2Df7301";
// sendtx(chain3.mc.accounts[0], scsm, 20);
// waitBalance(scsm, 20);

addfundtosubchain(subchainbase.address);
waitBalance(subchainbase.address, 10);

//==========================================================================
//==========================================================================
console.log("Registering SCS to the pool");

registertopool(subchainprotocolbase.address, scs1);
registertopool(subchainprotocolbase.address, scs2);
registertopool(subchainprotocolbase.address, scs3);

while (true) {
    let count = subchainprotocolbase.scsCount();
    if (count > 2) {
      console.log("registertopool has enough scs " + count);
      break;
    }
    console.log("Waiting registertopool, current scs count=" + count);
    sleep(5000);
}

let scslist=subchainprotocolbase.scsList(scs3);
//let scslist=subchainprotocolbase.scsList(scs1);
console.log(scslist);

let startnum = chain3.mc.blockNumber;
while (true) {
    let number = chain3.mc.blockNumber;
    if (number > startnum + 5) {
      console.log("reached target block number " + number);
      break;
    }
    console.log("Waiting block number, current block number=" + number);
    sleep(5000);
}

registeropen();
while (true) {
    let count = subchainbase.nodeCount();
    if (count > 0) {
      console.log("registertopool has enough scs " + count);
      break;
    }
    console.log("Waiting registertopool, current scs count=" + count);
    sleep(5000);
}

registerclose();
sleep(15000);
console.log("register monitor");
subchainRegisterAsMonitor(scsm, bmin);

console.log("All done!!!\n");
sleep(1000);
console.log("Please go to testnet.moac.io to monitor the microchain.\n");
sleep(1000);
console.log("Subchain Base Address: " + subchainbase.address + "\n");
sleep(1000);
console.log("IP: 52.42.170.217\n");
console.log("Port: 8548\n");

function registertopool(contractadd, scsaddress) {
    var registerdata = "0x4420e486000000000000000000000000"+scsaddress.substring(2);
    sendtx(chain3.mc.coinbase, contractadd, 12, registerdata);
}

function registeropen() {
    sendtx(chain3.mc.coinbase, subchainbase.address, 0, "0x5defc56c");
}

function addfundtosubchain() {
    sendtx(chain3.mc.coinbase, subchainbase.address, 10, "0xa2f09dfa");
}

function registerclose() {
    sendtx(chain3.mc.coinbase, subchainbase.address, 0, "0x69f3576f");
}

function subchainRegisterAsMonitor(scsAddr, coins)
{
  sendtx(chain3.mc.coinbase, subchainbase.address, coins, "0x4e592e2f000000000000000000000000" + scsAddr.substring(2) );
}

function waitBlock(transactionHash) {
  while (true) {
    let receipt = chain3.mc.getTransactionReceipt(transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("contract has been deployed at " + receipt.contractAddress);
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + chain3.mc.blockNumber);
    sleep(5000);
  }
}

function waitBalance(addr, target) {
    while (true) {
        let balance = chain3.mc.getBalance(addr)/1000000000000000000;
        if (balance >= target) {
          console.log("account has enough balance " + balance);
          break;
        }
        console.log("Waiting the account has enough balance " + balance);
        sleep(5000);
    }
  }

function sendtx(src, tgtaddr, amount, strData) {

  chain3.mc.sendTransaction(
    {
      from: src,
      value:chain3.toSha(amount,'mc'),
      to: tgtaddr,
      gas: "2000000",
      gasPrice: chain3.mc.gasPrice,
      data: strData
    });
    
  console.log('sending from:' +   src + ' to:' + tgtaddr  + ' amount:' + amount + ' with data:' + strData);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
