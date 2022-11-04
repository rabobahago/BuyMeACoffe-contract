const hre = require("hardhat");
// return the ether balance of a given address
async function getBalance(address) {
  //getBalance from ethers return a balance of a give address
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
  /**
   * get balances before coffee purchase
   */

  const addresses = [
    owner.address,
    tipper.address,
    buyMeACoffee.address,
    tipper2.address,
    tipper3.address,
  ];
  console.log("==start==");
  await printBalances(addresses);
  /**
   *  buy the owner a few coffees
   */

  const tips = { value: hre.ethers.utils.parseEther("1") };
  //connect to second account because by default it has been connected to account one
  //note the tips param is optional
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Rabo Yusuf", "I love this coffee industry", tips);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee(
      "Martins Matthew",
      "I can consume every cup of this coffee",
      tips
    );
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Racheal Amanga", "coffee! coffee!! coffee!!", tips);
  //get balances after the coffee was purchase
  console.log("==bought coffee==");
  await printBalances(addresses);
  //withdraw funds.
  await buyMeACoffee.connect(owner).withdrawTips();
  //check balance after withdraw
  console.log("== withdrawTips ==");
  await printBalances(addresses);
  //read all the memos left for the owner
  console.log("== memo ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
