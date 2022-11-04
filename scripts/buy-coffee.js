const hre = require("hardhat");
// return the ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}
//log the ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`address at ${idx} balance:`, await getBalance(address));
    idx++;
  }
}
//logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} ${tipperAddress} said: ${message}`);
  }
}
async function main() {
  //get example account
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  //console.log(address);
  //get the contract to deploy and deploy it
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(`BuyMeACoffee contract deployed to ${buyMeACoffee.address}`);
  //get balances before coffee purchase
  const addresses = [
    owner.address,
    tipper.address,
    buyMeACoffee.address,
    tipper2.address,
    tipper3.address,
  ];
  console.log("==start==");
  await printBalances(addresses);
  //buy the owner a few coffees
  //get balances after the coffee was purchase
  //withdraw funds.
  //check balance after withdraw
  //read all the memos left for the owner
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
