
import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import SwapBox from "./components/SwapBox";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);

  return (
    <div className="app-container" style={{ padding: 20 }}>
      <h1>SimpleSwap App</h1>
      <ConnectWallet setAccount={setAccount} />
      {account && <SwapBox account={account} />}
    </div>
  );
}

export default App;
