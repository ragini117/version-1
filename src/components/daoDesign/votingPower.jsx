import { deodAribaContractAbi, deodIndusContractAbi, deodTokenContract, deodTokenContractAbi, deodTokenContractBNB, deodTokenContractBNBAbi } from "@/abi/Abi";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

// export const getVotingPower = async (address, blockNumber) => {
//     try {
//       const web3 = new Web3Provider(window.ethereum);
//       const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/0a133c0df94c4c20b531fdc50f5244dd`)
//       const providerBnb = new ethers.providers.JsonRpcProvider(`https://bnb-mainnet.g.alchemy.com/v2/alch_zzlnH37zC1qn9vjv9Qz7e`)

//       const network = "11155111";
//       const ERC20_CONFIG = {
//         name: "erc20-balance-of",
//         params: {
//           address: deodTokenContract,
//           abi: deodTokenContractAbi,
//           symbol: "DEOD",
//           decimals: 18,
//         },
//       }
//       const ERC721_CONFIG = {
//         name: "erc721-multi-registry-weighted",
//         params: {
//           symbol: "LAND",
//           tokens: [
//             {
//               address: "0xdBd34637BC7793DDC2A02A89b3E6592249a45a12",
//               abi: deodIndusContractAbi
//             },
//             {
//               address: "0x9536f0897650FC95F6121eFa1dFdEDf250f438f5",
//               abi: deodAribaContractAbi
//             }

//           ],
//           weights: [2000, 4000, 8000, 25000],
//         },
//       }
//       const ranges = [
//         { name: "Mega", points: 25000, ranges: [[1, 20], [4001, 4200]] },
//         { name: "Large", points: 8000, ranges: [[21, 200], [4201, 4600]] },
//         { name: "Medium", points: 4000, ranges: [[201, 800], [4601, 5400]] },
//         { name: "Unit", points: 2000, ranges: [[801, 3610], [5401, 7000]] }
//       ];
//       const erc20 = new ethers.Contract(ERC20_CONFIG.params.address, ERC20_CONFIG.params.abi, providerBnb);
//       const balance = await erc20.balanceOf(address, {
//         blockTag: blockNumber,
//       });
//       let votingPower = 0;
//       // if (ethers.utils.formatEther(balance) >= "200") {
//         const normalized = Number(ethers.utils.formatEther(balance));
//         votingPower += normalized;
//       // }
//       for (let i = 0; i < 2; i++) {
//         const nftAddress = ERC721_CONFIG.params.tokens[i].address;
//         const nftAbi = ERC721_CONFIG.params.tokens[i].abi;
//         const weight = ERC721_CONFIG.params.weights[i];

//         const nft = new ethers.Contract(nftAddress, nftAbi, provider);
//         const nftBalance = await nft.balanceOf(address, {
//         blockTag: blockNumber,
//       });
//         for (let a = 0; a < nftBalance; a++) {
//           const tokenId = await nft.tokenOfOwnerByIndex(address, a);
//           const id = tokenId.toNumber ? tokenId.toNumber() : Number(tokenId);

//           // Check in which range this tokenId falls
//           for (const category of ranges) {
//             for (const [min, max] of category.ranges) {
//               if (id >= min && id <= max) {
//                 votingPower += category.points;
//                 break; // stop checking once matched
//               }
//             }
//           }
//         }
//         // each NFT at this contract contributes `weight` voting power
//         // votingPower += Number(nftBalance) * weight;

//       }

//       return votingPower;
//     } catch (error) {
//       console.error("Error getting VP :", error.message);
//       throw error;
//     }
//   };

export const getVotingPower = async (address, blockNumber) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/alch_zzlnH37zC1qn9vjv9Qz7e", { chainId: 137, name: "matic" });
            const providerBnb = new ethers.providers.JsonRpcProvider("https://bnb-mainnet.g.alchemy.com/v2/alch_zzlnH37zC1qn9vjv9Qz7e", { chainId: 56, name: "bnb" });

            const ERC721_CONFIG = {
                name: "erc721-multi-registry-weighted",
                params: {
                    symbol: "LAND",
                    tokens: [
                        {
                            address:
                                "0xdBd34637BC7793DDC2A02A89b3E6592249a45a12",
                            abi: deodIndusContractAbi,
                        },
                        {
                            address:
                                "0x9536f0897650FC95F6121eFa1dFdEDf250f438f5",
                            abi: deodAribaContractAbi,
                        },
                    ],
                    weights: [2000, 4000, 8000, 25000],
                },
            };
            const ranges = [
                {
                    name: "Mega",
                    points: 25000,
                    ranges: [
                        [1, 20],
                        [4001, 4200],
                    ],
                },
                {
                    name: "Large",
                    points: 8000,
                    ranges: [
                        [21, 200],
                        [4201, 4600],
                    ],
                },
                {
                    name: "Medium",
                    points: 4000,
                    ranges: [
                        [201, 800],
                        [4601, 5400],
                    ],
                },
                {
                    name: "Unit",
                    points: 2000,
                    ranges: [
                        [801, 3610],
                        [5401, 7000],
                    ],
                },
            ];
            // DEOD balance — check both BSC (new) and Polygon (old) and sum
            let votingPower = 0;
            try {
                const erc20Bnb = new ethers.Contract(deodTokenContractBNB, deodTokenContractBNBAbi, providerBnb);
                const balanceBnb = await erc20Bnb.balanceOf(address);
                votingPower += Number(ethers.utils.formatEther(balanceBnb));
            } catch (err) {
                console.warn("DEOD BSC balance check failed:", err.message);
            }
            try {
                const erc20Poly = new ethers.Contract(deodTokenContract, deodTokenContractAbi, provider);
                const balancePoly = await erc20Poly.balanceOf(address);
                votingPower += Number(ethers.utils.formatEther(balancePoly));
            } catch (err) {
                console.warn("DEOD Polygon balance check failed:", err.message);
            }

            // NFT VP on Polygon
            try {
                for (let i = 0; i < 2; i++) {
                    const nftAddress = ERC721_CONFIG.params.tokens[i].address;
                    const nftAbi = ERC721_CONFIG.params.tokens[i].abi;
                    const nft = new ethers.Contract(nftAddress, nftAbi, provider);
                    const nftBalance = await nft.balanceOf(address);
                    for (let a = 0; a < nftBalance; a++) {
                        const tokenId = await nft.tokenOfOwnerByIndex(address, a);
                        const id = tokenId.toNumber ? tokenId.toNumber() : Number(tokenId);
                        for (const category of ranges) {
                            for (const [min, max] of category.ranges) {
                                if (id >= min && id <= max) {
                                    votingPower += category.points;
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn("NFT VP check failed:", err.message);
            }

            return votingPower;
        } catch (error) {
            console.error("Error getting VP :", error.message);
            throw error;
        }
    };

export const getVotingPowerBreakdown = async (address, blockNumber) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/alch_zzlnH37zC1qn9vjv9Qz7e", { chainId: 137, name: "matic" });
        const providerBnb = new ethers.providers.JsonRpcProvider("https://bnb-mainnet.g.alchemy.com/v2/alch_zzlnH37zC1qn9vjv9Qz7e", { chainId: 56, name: "bnb" });
        const nftContracts = [
            { address: "0xdBd34637BC7793DDC2A02A89b3E6592249a45a12", abi: deodIndusContractAbi },
            { address: "0x9536f0897650FC95F6121eFa1dFdEDf250f438f5", abi: deodAribaContractAbi },
        ];
        const ranges = [
            { name: "Mega",   points: 25000, ranges: [[1, 20],    [4001, 4200]] },
            { name: "Large",  points: 8000,  ranges: [[21, 200],  [4201, 4600]] },
            { name: "Medium", points: 4000,  ranges: [[201, 800], [4601, 5400]] },
            { name: "Unit",   points: 2000,  ranges: [[801, 3610],[5401, 7000]] },
        ];

        // DEOD balance (BNB chain)
        const erc20 = new ethers.Contract(deodTokenContract, deodTokenContractAbi, providerBnb);
        const balance = await erc20.balanceOf(address);
        const deodBalance = Number(ethers.utils.formatEther(balance));

        // NFT VP per category (Polygon)
        const categoryMap = {};
        for (const cat of ranges) {
            categoryMap[cat.name] = { count: 0, vpPerToken: cat.points, totalVp: 0 };
        }
        let nftVP = 0;
        for (const contract of nftContracts) {
            const nft = new ethers.Contract(contract.address, contract.abi, provider);
            const nftBalance = await nft.balanceOf(address);
            for (let a = 0; a < nftBalance; a++) {
                const tokenId = await nft.tokenOfOwnerByIndex(address, a);
                const id = tokenId.toNumber ? tokenId.toNumber() : Number(tokenId);
                for (const cat of ranges) {
                    let matched = false;
                    for (const [min, max] of cat.ranges) {
                        if (id >= min && id <= max) {
                            categoryMap[cat.name].count++;
                            categoryMap[cat.name].totalVp += cat.points;
                            nftVP += cat.points;
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }
            }
        }

        const parcels = Object.entries(categoryMap)
            .filter(([, v]) => v.count > 0)
            .map(([name, v]) => ({ category: name, count: v.count, vpPerToken: v.vpPerToken, totalVp: v.totalVp }));

        return {
            total: deodBalance + nftVP,
            deodBalance,
            deodVP: deodBalance,
            nftVP,
            parcels,
            hasParcels: parcels.length > 0,
        };
    } catch (error) {
        console.error("Error getting VP breakdown:", error.message);
        throw error;
    }
};