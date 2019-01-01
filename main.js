const SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block{
  constructor(timestamp, transactions, previoushash = ''){
      this.transactions = transactions;
      this.timestamp = timestamp;
      this.previoushash = previoushash;
      this.hash = '';
      this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Mined: "+this.hash)
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.reward = 100;
  }
  createGenesisBlock(){
    return new Block("01/01/2018", "Genesis Block", "0");
  }
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  // addBlock(newBlock){
  //   newBlock.previoushash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }
  minePendingTransactions(RewardAddress){
    let newBlock = new Block(Date.now(), this.pendingTransactions);
    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);

    this.pendingTransactions = [
      new Transaction(null, RewardAddress, this.reward)
    ];
  }
  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }
  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress == address){
          balance -= trans.amount;
        }
        if(trans.toAddress == address){
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
  isChainValid(){
    for(let i=1; i<this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }
      if(currentBlock.previoushash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let MyCoin = new Blockchain();
MyCoin.createTransaction(new Transaction('A','B',100));
MyCoin.createTransaction(new Transaction('B','C',70));

MyCoin.minePendingTransactions('Mihir');
console.log('Miner balance is: ' + MyCoin.getBalanceOfAddress('Mihir'));
MyCoin.minePendingTransactions('Mihir');
console.log('Miner balance is: ' + MyCoin.getBalanceOfAddress('Mihir'));
// console.log('Mining Block 1...');
// MyCoin.addBlock(new Block(1, Date.now(), { amount: 4}));
// console.log('Mining Block 2...');
// MyCoin.addBlock(new Block(2, Date.now(), { amount: 10}));

// console.log(JSON.stringify(MyCoin, null, 4));

// console.log("Is Blockchain Valid?: " + MyCoin.isChainValid());
// MyCoin.chain[1].data = {amount:100};
// console.log("Is Blockchain Valid?: " + MyCoin.isChainValid());
