// Certifique-se de que está utilizando ethers
const { ethers } = require("hardhat");
const main = async () => {
  let provider = ethers.getDefaultProvider();
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await provider.getBalance(deployer.address);

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const Token = await hre.ethers.deployContract("MemberPortal");
  const portal = await Token.waitForDeployment();

  console.log("Fsociety_Member address: ", portal.target);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});