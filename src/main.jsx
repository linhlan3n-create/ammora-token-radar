import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { giwaSepoliaAutoRouteDeployment } from '@ammora-protocol/sdk'
import './style.css'

const TARGET_CHAIN_ID = 91342
const TARGET_CHAIN_HEX = '0x' + TARGET_CHAIN_ID.toString(16)

function shortAddress(value) {
  return value ? `${value.slice(0, 6)}…${value.slice(-4)}` : ''
}

function App() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')
  const [walletMessage, setWalletMessage] = useState('')
  const [busy, setBusy] = useState(false)

  // Use the official SDK's published GIWA Sepolia deployment catalog.
  const deployment = giwaSepoliaAutoRouteDeployment
  const sdkChainId = Number(deployment.chain.id)
  const launchProtocolVersion = deployment.contracts.launch.protocolVersion
  const configRegistry = deployment.contracts.launch.configRegistry

  useEffect(() => {
    const ethereum = window.ethereum
    if (!ethereum?.request) return
    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => { if (accounts?.[0]) setAccount(accounts[0]) })
      .catch(() => {})
    ethereum.request({ method: 'eth_chainId' })
      .then(setChainId)
      .catch(() => {})
    const onAccounts = accounts => setAccount(accounts?.[0] || '')
    const onChain = id => setChainId(id)
    ethereum.on?.('accountsChanged', onAccounts)
    ethereum.on?.('chainChanged', onChain)
    return () => {
      ethereum.removeListener?.('accountsChanged', onAccounts)
      ethereum.removeListener?.('chainChanged', onChain)
    }
  }, [])

  async function connectWallet() {
    const ethereum = window.ethereum
    if (!ethereum?.request) {
      setWalletMessage('No EIP-1193 wallet found. Install MetaMask or another injected wallet.')
      return
    }
    setBusy(true)
    setWalletMessage('')
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts?.[0] || '')
      const currentChain = await ethereum.request({ method: 'eth_chainId' })
      setChainId(currentChain)
      if (currentChain !== TARGET_CHAIN_HEX) {
        try {
          await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: TARGET_CHAIN_HEX }] })
          setChainId(TARGET_CHAIN_HEX)
          setWalletMessage('Wallet connected. GIWA Sepolia selected.')
        } catch {
          setWalletMessage('Wallet connected, but network switch was not completed. Please select GIWA Sepolia in your wallet.')
        }
      } else {
        setWalletMessage('Wallet connected to GIWA Sepolia.')
      }
    } catch (error) {
      setWalletMessage(error?.message || 'Wallet connection was cancelled or failed.')
    } finally {
      setBusy(false)
    }
  }

  const onTargetNetwork = chainId?.toLowerCase() === TARGET_CHAIN_HEX.toLowerCase()

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">◢</span><span>Ammora<span className="muted"> / Radar</span></span></a>
        <nav><a className="active" href="#overview">Overview</a><a href="#network">Network</a><a href="#about">About</a></nav>
        <button className="wallet-button" onClick={connectWallet} disabled={busy}>
          {busy ? 'Connecting…' : account ? shortAddress(account) : 'Connect wallet'}
        </button>
      </header>

      <section className="hero" id="overview">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> AMMORA SDK · GIWA TESTNET</div>
          <h1>Token radar<span>.</span></h1>
          <p>Explore Ammora launch infrastructure and inspect the GIWA Sepolia deployment from one focused workspace.</p>
          <div className="hero-actions"><a className="primary" href="#network">Explore network ↓</a><a className="secondary" href="https://docs.ammora.org/guides/sdk-quickstart" target="_blank" rel="noreferrer">SDK quickstart ↗</a></div>
        </div>
        <div className="orb-wrap" aria-hidden="true"><div className="orb"><div className="orb-core"/></div><span className="orbit-label">GIWA / 91342</span></div>
      </section>

      <section className="stats">
        <article><span>NETWORK</span><strong>GIWA Sepolia</strong></article>
        <article><span>CHAIN ID</span><strong>{sdkChainId}</strong></article>
        <article><span>SDK VERSION</span><strong>0.3.9</strong></article>
        <article><span>PROTOCOL</span><strong>V{launchProtocolVersion}</strong></article>
      </section>

      <section className="content-grid" id="network">
        <div className="panel">
          <div className="panel-heading"><div><span className="eyebrow">DEPLOYMENT</span><h2>Network details</h2></div><span className={`status ${sdkChainId === TARGET_CHAIN_ID ? 'ok' : 'warn'}`}>{sdkChainId === TARGET_CHAIN_ID ? 'Catalog loaded' : 'Check chain'}</span></div>
          <div className="detail-row"><span>Configured chain</span><strong>{sdkChainId}</strong></div>
          <div className="detail-row"><span>Launch protocol</span><strong>V{launchProtocolVersion}</strong></div>
          <div className="detail-row"><span>Config registry</span><code>{configRegistry || 'Not exposed in catalog'}</code></div>
          <div className="detail-row"><span>Connected wallet</span><strong>{account ? shortAddress(account) : 'Not connected'}</strong></div>
          <div className="detail-row"><span>Wallet network</span><strong className={onTargetNetwork ? 'green' : 'orange'}>{chainId ? (onTargetNetwork ? 'GIWA Sepolia' : `Chain ${parseInt(chainId, 16)}`) : 'Not detected'}</strong></div>
          {walletMessage && <p className="notice">{walletMessage}</p>}
          <p className="footnote">Read-only deployment information from the SDK catalog. This page does not create launches or send transactions.</p>
        </div>

        <div className="panel explorer-panel">
          <div className="panel-heading"><div><span className="eyebrow">DISCOVERY</span><h2>Launch explorer</h2></div><span className="status">Read-only</span></div>
          <div className="empty-state"><div className="radar-icon">◎</div><h3>Launch data connection</h3><p>This starter intentionally does not invent an indexer endpoint or sample token records. Connect the documented Ammora data API in the next integration step to show live launches.</p><a href="https://docs.ammora.org/examples" target="_blank" rel="noreferrer">Browse official SDK examples ↗</a></div>
        </div>
      </section>

      <footer id="about"><span className="brand-mark">◢</span><span>Ammora Token Radar</span><span className="footer-right">TESTNET ONLY · SDK 0.3.9</span></footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
