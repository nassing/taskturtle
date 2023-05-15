const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const TaskTurtle = artifacts.require("TaskTurtle");

const fs = require('fs-extra');
const path = require('path');

module.exports = async function (deployer) {
  await deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  await deployer.deploy(MetaCoin);
  await deployer.deploy(TaskTurtle);

  const contracts = [
    { contractName: 'ConvertLib', artifact: ConvertLib },
    { contractName: 'MetaCoin', artifact: MetaCoin },
    { contractName: 'TaskTurtle', artifact: TaskTurtle }
  ];

  const filePath = path.join(__dirname, '../../app/public/contractAddresses.txt'); // Specify the file path where you want to write the contract addresses
  const artifactsDestination = path.join(__dirname, '../../app/src/contracts'); // Specify the destination folder where you want to copy the artifacts

  let addresses = '';

  for (const contract of contracts) {
    const contractInstance = await contract.artifact.deployed();
    const contractAddress = contractInstance.address;
    addresses += `${contract.contractName}: ${contractAddress}\n`;
    console.log(`Contract address for ${contract.contractName}:`, contractAddress);

    // Write ABI to file
    const abiContent = JSON.stringify(contract.artifact.abi);
    const abiFilePath = path.join(artifactsDestination, `${contract.contractName}.abi.json`);
    fs.writeFileSync(abiFilePath, abiContent, 'utf-8');
    console.log(`ABI for ${contract.contractName} written to ${abiFilePath}`);
  }

  fs.writeFileSync(filePath, addresses, 'utf-8');
  console.log('Contract addresses written to contractAddresses.txt');
};


