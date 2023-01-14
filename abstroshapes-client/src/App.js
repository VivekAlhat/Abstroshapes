import "./styles/App.css";
import AbstroShapesNFT from "./AbstroShapesNFT.json";
import { ethers } from "ethers";
import { ScaleLoader } from "react-spinners";
import React, { useEffect, useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask!");
      return;
    } else {
      console.log("Metamask found!", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentUser(account);

      setupEventListener();
    } else {
      console.log("Zero accounts found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install Metamask client to continue.");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const user = accounts[0];
      setCurrentUser(user);

      setupEventListener();
    } catch (err) {
      alert(err.message);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x10751e42BbCE368d9bcEF0148ba8AD301464392b";

    setLoading(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          AbstroShapesNFT.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.createNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );

        setLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    const CONTRACT_ADDRESS = "0x10751e42BbCE368d9bcEF0148ba8AD301464392b";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          AbstroShapesNFT.abi,
          signer
        );

        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Abstroshapes NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Each abstract.
          </p>
          <p className="sub-text">Get your NFT today.</p>
          {currentUser === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              {loading ? <ScaleLoader /> : "Mint NFT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
