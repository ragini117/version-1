const networkData = {
    sepolia: {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://rpc.sepolia.org"],
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
    bnbTestnet: {
      chainId: "0x61",
      chainName: "BNB Smart Chain Testnet",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },

    /* --- BSC MAINNET --- */
    bsc: {
      chainId: "0x38", // 56 decimal
      chainName: "BNB Smart Chain Mainnet",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com"],
    },

    /* --- POLYGON MAINNET --- */
    polygon: {
      chainId: "0x89", // 137 decimal
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  };

export const switchNetworks = async (networkName) => {
    const network = networkData[networkName];
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
      console.log("network switched");
    } catch (switchError) {

      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
          console.log("network switched");
        } catch (addError) {
          console.log(addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };