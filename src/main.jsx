> import React, { useState, useEffect } from 'react'
> import { createRoot } from 'react-dom/client'
> import { giwaSepoliaAutoRouteDeployment } from '@ammora-protocol/sdk'
> import './style.css'
> 
> const TARGET_CHAIN_ID = 91342
> const TARGET_CHAIN_HEX = '0x' + TARGET_CHAIN_ID.toString(16)
> 
> function shortAddress(value) {
>   return value ? `${value.slice(0, 6)}...${value.slice(-4)}` : ''
> }
> 
> function App() {
>   const [account, setAccount] = useState('')
>   const [chainId, setChainId] = useState('')
>   const [walletMessage, setWalletMessage] = useState('')
>   const [busy, setBusy] = useState(false)
> 
>   const deployment = giwaSepoliaAutoRouteDeployment
>   const sdkChainId = Number(deployment.chain.id)
>   const launchProtocolVersion = deployment.contracts.launch.protocolVersion
>   const configRegistry = deployment.contracts.launch.configRegistry
> 
>   useEffect(() => {
>     const ethereum = window.ethereum
>     if (!ethereum) return
> 
>     ethereum.request({ method: 'eth_accounts' })
>       .then(accounts => { if (accounts?.[0]) setAccount(accounts[0]) })
>       .catch(() => {})
> 
>     ethereum.request({ method: 'eth_chainId' })
>       .then(setChainId)
>       .catch(() => {})
> 
>     const onAccounts = accounts => setAccount(accounts?.[0] || '')
>     const onChain = id => setChainId(id)
> 
>     ethereum.on?.('accountsChanged', onAccounts)
>     ethereum.on?.('chainChanged', onChain)
> 
>     return () => {
>       ethereum.removeListener?.('accountsChanged', onAccounts)
>       ethereum.removeListener?.('chainChanged', onChain)
>     }
>   }, [])
> 
>   async function connectWallet() {
>     const ethereum = window.ethereum
>     if (!ethereum?.request) {
>       setWalletMessage('No EIP-1193 wallet found. Install MetaMask or another injected wallet.')
>       return
>     }
>     setBusy(true)
>     setWalletMessage('')
>     try {
>       const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
>       setAccount(accounts?.[0] || '')
>       const currentChain = await ethereum.request({ method: 'eth_chainId' })
>       setChainId(currentChain)
>       if (currentChain !== TARGET_CHAIN_HEX) {
>         try {
>           await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: TARGET_CHAIN_HEX }] })
>           setChainId(TARGET_CHAIN_HEX)
>           setWalletMessage('Wallet connected. GIWA Sepolia selected.')
>         } catch {
>           setWalletMessage('Wallet connected, but network switch was not completed. Please select GIWA Sepolia in your wallet.')
>         }
>       } else {
>         setWalletMessage('Wallet connected to GIWA Sepolia.')
>       }
>     } catch (error) {
>       setWalletMessage(error?.message || 'Wallet connection was cancelled or failed.')
>     } finally {
>       setBusy(false)
>     }
>   }
> 
>   const onTargetNetwork = chainId?.toLowerCase() === TARGET_CHAIN_HEX.toLowerCase()
> 
>   return (
>     <div className="app-shell">
>       <header className="topbar">
>         <div className="brand"><span className="brand-mark">A</span> Ammora / Radar</div>
>         <nav className="nav">
>           <a className="active" href="#overview">Overview</a>
>           <a href="#network">Network</a>
>           <a href="#about">About</a>
>         </nav>
>         <button className="btn btn-primary" onClick={connectWallet} disabled={busy}>
>           {account ? shortAddress(account) : 'Connect wallet'}
>         </button>
>       </header>
> 
>       <section className="hero" id="overview">
>         <div>
>           <div className="eyebrow">AMMORA PROTOCOL / TESTNET</div>
>           <h1>Token radar.</h1>
>           <p>Explore Ammora launch infrastructure and inspect the GIWA Sepolia deployment from one focused workspace.</p>
>           <div className="hero-actions">
>             <a className="btn btn-primary" href="#network">Explore network ↓</a>
>             <a className="btn btn-ghost" href="https://docs.ammora.org/guides/sdk-quickstart" target="_blank" rel="noreferrer">SDK quickstart ↗</a>
>           </div>
>         </div>
>         <div className="panel">
>           <div className="detail-row"><span>Network</span><strong>GIWA Sepolia</strong></div>
>           <div className="detail-row"><span>Chain ID</span><strong>{sdkChainId}</strong></div>
>           <div className="detail-row"><span>SDK</span><strong>0.3.9</strong></div>
>           <div className="detail-row"><span>Protocol</span><strong>V{launchProtocolVersion}</strong></div>
>         </div>
>       </section>
> 
>       <section className="stats">
>         <div className="stat"><span>NETWORK</span><strong>GIWA Sepolia</strong></div>
>         <div className="stat"><span>CHAIN ID</span><strong>{sdkChainId}</strong></div>
>         <div className="stat"><span>PROTOCOL SDK</span><strong>v0.3.9</strong></div>
>         <div className="stat"><span>ENVIRONMENT</span><strong>Testnet</strong></div>
>       </section>
> 
>       <section className="content" id="network">
>         <div className="panel">
>           <div className="eyebrow">DEPLOYMENT</div>
>           <h2>Network details</h2>
>           <div className="detail-row"><span>Configured chain</span><strong>{sdkChainId}</strong></div>
>           <div className="detail-row"><span>Launch protocol</span><strong>V{launchProtocolVersion}</strong></div>
>           <div className="detail-row"><span>Config registry</span><code>{configRegistry || 'Not exposed in catalog'}</code></div>
>           <div className="detail-row"><span>Connected wallet</span><strong>{account ? shortAddress(account) : 'Not connected'}</strong></div>
>           <div className="detail-row"><span>Wallet network</span><strong className={onTargetNetwork ? 'green' : 'orange'}>{chainId ? (onTargetNetwork ? 'GIWA Sepolia' : `Chain ${chainId}`) : 'Not connected'}</strong></div>
>           {walletMessage && <p className="footnote">{walletMessage}</p>}
>           <p className="footnote">Read-only deployment information from the SDK catalog. This page does not create launches or send transactions.</p>
>         </div>
> 
>         <div className="panel">
>           <div className="eyebrow">DISCOVERY</div>
>           <h2>Launch explorer</h2>
>           <p className="footnote">This starter intentionally does not invent an indexer endpoint or fake token/launch records.</p>
>         </div>
>       </section>
> 
>       <footer id="about">
>         <span>▲ Ammora Token Radar</span>
>         <span>TESTNET ONLY · SDK 0.3.9</span>
>       </footer>
 </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
