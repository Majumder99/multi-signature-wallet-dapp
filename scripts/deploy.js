const hre = require("hardhat");
async function main() {
  const [deployer, owner1, owner2, owner3] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const MultiSig = await hre.ethers.getContractFactory("MultiSig");
  // deploy contracts
  const owners = [owner1.address, owner2.address, owner3.address];
  const multisig = await MultiSig.deploy(owners, 3);
  await multisig.deployed();
  console.log("Contract address multisig", multisig.address);
  console.log(
    "Account balance after deployed :",
    (await deployer.getBalance()).toString()
  );
  console.log("Owners : ", owner1.address, owner2.address, owner3.address);
  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(multisig, "MultiSig");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../ContractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = hre.artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
