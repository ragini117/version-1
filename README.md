This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



## for AWS Putty

```bash
ubuntu
rm -rf .next
npm run build
pm2 start npm --name "deod-app" -- start
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


// "use client";
// import Link from 'next/link';
// import styles from './proposalDetail.module.css'
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Apiurl2 } from '../../../environment';
// import snapshot from "@snapshot-labs/snapshot.js";

// import { Web3Provider } from '@ethersproject/providers';
// const ProposalDetail = () => {
//   const params = useParams();
//   const id = params.slug;
//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [snapShotId, setSnapShot] = useState("")
//   const comments = [
//     {
//       username: 'Tudamoon',
//       timeAgo: '7 days ago',
//       comment: '@web3init Can you share what options I should have included or what makes it invalid?',
//     },
//     {
//       username: 'HPivakos',
//       timeAgo: '6 days ago',
//       comment: 'I like the idea of bounties, many open source projects use them to encourage people to contribute. But to put bounties, the DAO should first have a roadmap so we can align all ideas.',
//     },
//     {
//       username: 'CheddarQueso',
//       timeAgo: '6 days ago',
//       comment: 'Foundation is doing this in similar fashion with Game Expo and other big events. Seems to be yielding much better than the grants system. Bounties work well and I believe we should try this route but the DAO doesn’t have a clear direction or roadmap for the future, especially as it relates to the next 7 years of working alongside foundation. Projects need to be in line with specific production goals and development roadmaps, of which we have none. What is the role of the DAO in developing the platform and how are we preparing to take over the duties that foundation is currently performing?',
//     },
//     {
//       username: 'Tudamoon',
//       timeAgo: '6 days ago',
//       comment: 'The idea was the DAO members would propose overall goal and then list milestones to get there. Then every milestone is a bounty. Sorta like an open source project. People only get paid upon completion.',
//     },
//     {
//       username: 'punkpink',
//       timeAgo: '5 days ago',
//       comment: 'I am not directly opposed to a bounties system, but I believe it is yet another attempt to boost creativity in Decentraland that will not succeed. The fact that Decentraland is literally a desert is due to deeper factors that cannot be resolved with changes like this.',
//     },
//   ];
//   const voteButton = async () => {
//     try {
//       const hub = "https://testnet.hub.snapshot.org";
//       const client = new snapshot.Client712(hub);

//       // Retrieve proposal data from localStorage
//       const snapshotReceipt = JSON.parse(localStorage.getItem('snapshotReceipt'));
//       if (!snapshotReceipt) {
//         throw new Error('Snapshot receipt data not found in localStorage');
//       }

//       const { id, relayer } = snapshotReceipt;

//       const web3 = new Web3Provider(window.ethereum);
//       const accounts = await web3.listAccounts();
//       const account = accounts[0];

//       const receipt = await client.vote(web3, account, {
//         space: 'monu.eth',
//         proposal: id,
//         type: 'single-choice',
//         choice: 2, // Adjust the choice based on your requirements
//         reason: 'Choice 2 makes a lot of sense', // Adjust the reason based on your requirements
//         app: 'Decentrawood DAO'
//       });

//       console.log("Vote receipt:", receipt);

//       // Store the voting receipt in localStorage
//       localStorage.setItem('snapshotReceipt', JSON.stringify({
//         id,
//         ipfs: snapshotReceipt.ipfs,
//         relayer: {
//           address: relayer.address,
//           receipt: receipt
//         }
//       }));

//       return client;
//     } catch (error) {
//       console.error("Error voting:", error.message);
//       throw error;
//     }
//   };
//   const connectWallet = async () => {
//     try {
//       const web3 = new Web3Provider(window.ethereum);
//       if (!web3) {
//         throw new Error("MetaMask not detected");
//       }
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const accounts = await web3.listAccounts();
//       const account = accounts[0];
//       console.log("Connected Testnet account:", account);
//       await voteButton();
//     } catch (error) {
//       console.error("Error connecting wallet:", error.message);
//     }
//   };
//   const getVotingPower = async () => {
//     try {
//       const web3 = new Web3Provider(window.ethereum);
//       const latestBlockNumber = await web3.getBlockNumber();
//       console.log("hash-1---->", latestBlockNumber);
//       const address = '0x232528c113c2666C604a4e9A3aA9458644B18550';
//       const network = '11155111';
//       const strategies = [
//         {
//           name: 'erc20-balance-of',
//           params: {
//             address: '0xE06E36824a4Da60D4000b83b89649a5f89D688e2',
//             symbol: 'DEOD',
//             decimals: 18
//           }
//         },
//         {
//           name: 'erc721-with-multiplier',
//           params: {
//             address: '0xbd6A545ff23Ef2A71a1FceA89D6728b16Cba35fd',
//             symbol: 'UNIT',
//             decimals: 18
//           }
//         }
//       ];
//       const snapshots = latestBlockNumber;
//       const space = 'monu.eth';
//       const delegation = true;
//       snapshot.utils.getVp(address, network, strategies, snapshots, space, delegation).then(vp => {
//         console.log('Voting Power', vp);
//       });
//     } catch (error) {
//       console.error("Error getting VP :", error.message);
//       throw error;
//     }
//   }
//   useEffect(() => {
//     const fetchProposalById = async () => {
//       try {
//         const response = await axios.get(`${Apiurl2}/DAO/proposal/${id}`);
//         if (response.data.status) {
//           // console.log("proposalDetail by id", id);
//           console.log(response.data)
//           setProposal(response.data.data);
//           setSnapShot(response.data.data.receipt.id);
//           // console.log("snap", snapShotId)
//         } else {
//           setError("Failed to fetch proposal");
//         }
//       } catch (error) {
//         setError("Error fetching proposal");
//       } finally {
//         setLoading(false);
//       }
//     };
//     // getVotingPower();

//     if (id) {
//       fetchProposalById();
//     }
//   }, [id]);
//   localStorage.getItem('snapshotReceipt')
//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!proposal) {
//     return <p>No proposal found.</p>;
//   }


//   // Format dates
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true // Set to true to display AM/PM
//     };
//     return date.toLocaleDateString('en-US', options);
//   };

//   const publishedDate = formatDate(proposal.startDate);
//   const votingBeginsDate = formatDate(proposal.startDate);
//   const votingEndsDate = formatDate(proposal.endDate);
//   const getSnapshotProposalUrl = (receiptId) => {
//     return `https://testnet.snapshot.org/#/monu.eth/proposal/${receiptId}`;
//   };
//   const truncateId = (id) => {
//     return id ? `${id.substring(0, 7)}...` : '';
//   };
//   const stripTags = (html) => {
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   };
//   return (
//     <div className={`container-fluid`}>
//       <nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ml-auto">
//             <li className="nav-item">
//               <Link
//                 className={`nav-link ${styles.navbar_cus_item}`}
//                 href="/dao/proposal"
//               >
//                 DAO Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link
//                 className={`nav-link ${styles.navbar_cus_item}`}
//                 href="/dao/proposal/proposalDetail"
//               >
//                 Proposals
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${styles.navbar_cus_item}`} href="#">
//                 Projects
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${styles.navbar_cus_item}`} href="#">
//                 Profile
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${styles.navbar_cus_item}`} href="#">
//                 Transparency
//               </Link>
//             </li>
//           </ul>
//           <form className={`${styles.navbar_searchh}`} role="search">
//             <input
//               className={` me-2 form-control ${styles.navbar_searchh_input}`}
//               type="search"
//               placeholder="Search"
//               aria-label="Search"
//             />
//             <i className="bi bi-search"></i>
//           </form>

//         </div>
//       </nav>
//       <div className={`${styles.header}`}>
//         <h1>Add the location {proposal.x},{proposal.y} to the Points of Interest</h1>

//         <div className={styles.status}>
//           {/* <span className={styles.active}><i className="bi bi-clock mx-1"></i>ENDED 4 HOURS AGO</span> */}
//           <span className={styles.poll}>{proposal.status}</span>

//           <span className={styles.poll}>{proposal.type}</span>
//         </div>
//       </div>
//       <div className='row py-5'>
//         <div className='col-md-3 col-12'>
//           <div className={styles.proposalDetails}>
//             <h6>PROPOSAL DETAILS</h6>
//             <div className="row">
//               <div className="col-6">
//                 <div className={`${styles.proposal_heading}`}>
//                   <p>Author:</p>
//                   <p>Published:</p>
//                   <p>Voting begins:</p>
//                   <p>Voting ends:</p>
//                   <p>Snapshot:</p>
//                 </div>
//               </div>
//               <div className="col-6">
//                 <div className={`${styles.proposal_heading_2}`}>
//                   <p className={`${styles.snapshot}`}>{proposal.Id}</p>
//                   <p className={`${styles.date_text}`}>{publishedDate}</p>
//                   <p className={`${styles.date_text}`}>{votingBeginsDate}</p>
//                   <p className={`${styles.date_text}`}>{votingEndsDate}</p>
//                   {/* <p className={`${styles.snapshot}`}>#{proposal.receipt.id}</p> */}
//                   <p > {proposal.receipt.id && (
//                     <a className={`${styles.snapshot_id}`} href={getSnapshotProposalUrl(proposal.receipt.id)} target="_blank" rel="noopener noreferrer">
//                       #{truncateId(proposal.receipt.id)}
//                     </a>
//                   )}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='col-md-6 col-12'>
//           <div className={`${styles.description}`}>
//             <p> {stripTags(proposal.description)}</p>
//             {/* <p>The intention behind this freeze was for people to work on fixing the systemic issues within the DAO.</p>
//             <p>At this time, it has become clear that no one is actively working on addressing any of the issues that many people seem to agree exist.</p>
//             <p>There is little reason to keep the grants program frozen temporarily if no one is going to take the time provided by the freeze to work on fixes and changes to the DAO.</p>
//             <p>So unless someone intends to pick up where Fehz left off, there seems to be no benefit from allowing the freeze to continue.</p> */}
//           </div>
//           {/* <div className={styles.cus_card}>
//             <h3 className={styles.heading}>About the governance process</h3>
//             <div className={styles.timeline}>
//               <div className={`${styles.timelineItem} ${styles.active}`}>
//                 <div className={styles.circle}>1</div>
//                 <div className={styles.content}>
//                   <h4 className={styles.title}>Poll</h4>
//                   <p className={styles.description}>Gather community input on important matters through a non-binding proposal to kickstart the Governance process.</p>
//                 </div>
//               </div>
//               <div className={styles.timelineItem}>
//                 <div className={styles.circle}>2</div>
//                 <div className={styles.content}>
//                   <h4 className={styles.title}>Draft</h4>
//                   <p className={styles.description}>Present a potential policy to the community in a structured format and formalize the discussion about the proposal’s potential impacts and implementation pathways.</p>
//                 </div>
//               </div>
//               <div className={styles.timelineItem}>
//                 <div className={styles.circle}>3</div>
//                 <div className={styles.content}>
//                   <h4 className={styles.title}>Governance Proposal</h4>
//                   <p className={styles.description}>Finalize the decision-making process in a binding proposal by submitting a comprehensive proposal with all relevant details for implementation.</p>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//           {/* <div className={styles.commentSection}>
//             <h3 className={styles.heading}>7 Comments</h3>
//             <div className={styles.commentsList}>
//               {comments.map((comment, index) => (
//                 <div key={index} className={styles.comment}>
//                   <img src="/dummy-profile.png" alt="User Avatar" className={styles.avatar} />
//                   <div className={styles.commentContent}>
//                     <div className={styles.commentHeader}>
//                       <span className={styles.username}>{comment.username}</span>
//                       <span className={styles.timeAgo}>{comment.timeAgo}</span>
//                     </div>
//                     <p className={styles.commentText}>{comment.comment}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <a className={styles.readMore}>READ MORE</a>
//           </div> */}
//         </div>
//         <div className="col-md-3 col-12">
//           <div className={`card ${styles.results}`}>
//             <h4 className={styles.heading}>CURRENT RESULTS</h4>
//             <div className={styles.resultItem}>
//               <div className={styles.result_head}>
//                 <p >Yes</p>
//                 <p>6%</p>
//               </div>
//               <div className={`progress ${styles.percentage_bar}`} role="progressbar" aria-label="Example with label" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
//                 <div className="progress-bar" style={{ width: '20%' }}>20%</div>
//               </div>
//               <div className={styles.result_vote}>
//                 <p>89,249 VP</p>
//                 <p>7 votes </p>
//               </div>
//             </div>
//             <div className={styles.resultItem}>
//               <div className={styles.result_head}>
//                 <p >No</p>
//                 <p>6%</p>
//               </div>
//               <div className={`progress ${styles.percentage_bar}`} role="progressbar" aria-label="Example with label" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
//                 <div className="progress-bar" style={{ width: '20%' }}>20%</div>
//               </div>
//               <div className={styles.result_vote}>
//                 <p>89,249 VP</p>
//                 <p>7 votes </p>
//               </div>
//             </div>
//             <div className={styles.resultItem}>
//               <div className={styles.result_head}>
//                 <p >Abstain</p>
//                 <p>6%</p>
//               </div>
//               <div className={`progress ${styles.percentage_bar}`} role="progressbar" aria-label="Example with label" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
//                 <div className="progress-bar" style={{ width: '20%' }}>20%</div>
//               </div>
//               <div className={styles.result_vote}>
//                 <p>89,249 VP</p>
//                 <p>7 votes </p>

//               </div>
//             </div>
//             <p>2 VP Threshold not reached</p>
//             <button className='btn btn-primary' onClick={connectWallet}>Vote</button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProposalDetail;