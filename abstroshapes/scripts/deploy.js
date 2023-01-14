const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "AbstroShapesNFT"
  );
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to: ", nftContract.address);

  let txn = await nftContract.createNFT();
  await txn.wait();

  txn = await nftContract.createNFT();
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// https://testnets.opensea.io/collection/abstroshapesnft
// 0x10751e42BbCE368d9bcEF0148ba8AD301464392b
