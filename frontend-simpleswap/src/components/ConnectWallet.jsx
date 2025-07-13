
import { useState } from "react";

export default function ConnectWallet({ setAccount }) {
  const [connected, setConnected] = useState(false);

  async function connect() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setConnected(true);
    } else {
      alert("Instalá MetaMask para continuar.");
    }
  }

  return (
    <button onClick={connect}>
      {connected ? "Wallet conectada" : "Conectar Wallet"}
    </button>
  );
}
