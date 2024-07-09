import { ArConnect } from 'arweavekit/auth'
if(!window.arweaveWallet) return 
const activeWallet = await window.arweaveWallet.getActiveAddress();