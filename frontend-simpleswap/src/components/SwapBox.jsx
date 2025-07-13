import { useState } from "react";
import { ethers } from "ethers";
import simpleSwapAbi from "../abi/SimpleSwap.json";
import erc20Abi from "../abi/ERC20.json"; // ABI mínimo para tokens ERC20

export default function SwapBox({ account }) {
  const [amountIn, setAmountIn] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState(null);
  const [totalLiquidity, setTotalLiquidity] = useState(null);
  const [userLiquidity, setUserLiquidity] = useState(null);

  const contractAddress = "0x30B0c8787F826D26811aD5216bF968980100B179";
  const tokenA = "0x3ecFd3E105CAa51BC3545ee1a6D8c74388d4457D";
  const tokenB = "0xb4B0ff6527e6F3352F4A620E7053e3dc66713aDE";

   async function handleAddLiquidity() {
    try {
      setStatus("Conectando a Ethereum...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, simpleSwapAbi, signer);
      const tokenContractA = new ethers.Contract(tokenA, erc20Abi, signer);
      const tokenContractB = new ethers.Contract(tokenB, erc20Abi, signer);

      const parsedA = ethers.parseUnits(amountA, 18);
      const parsedB = ethers.parseUnits(amountB, 18);

      // Verificar allowance token A
      setStatus("Verificando allowance de Token A...");
      let allowanceA = await tokenContractA.allowance(account, contractAddress);
      if (allowanceA < parsedA) {
        setStatus("Aprobando Token A...");
        const txApproveA = await tokenContractA.approve(contractAddress, parsedA);
        await txApproveA.wait();
      }

      // Verificar allowance token B
      setStatus("Verificando allowance de Token B...");
      let allowanceB = await tokenContractB.allowance(account, contractAddress);
      if (allowanceB < parsedB) {
        setStatus("Aprobando Token B...");
        const txApproveB = await tokenContractB.approve(contractAddress, parsedB);
        await txApproveB.wait();
      }

      const deadline = Math.floor(Date.now() / 1000) + 60;

      setStatus("Agregando liquidez...");
      const tx = await contract.addLiquidity(
        tokenA,
        tokenB,
        parsedA,
        parsedB,
        0, // amountAMin
        0, // amountBMin
        account,
        deadline
      );
      await tx.wait();

      setStatus("✅ Liquidez agregada correctamente");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error al agregar liquidez");
    }
  }

  async function handleFaucet() {
  try {
    setStatus("Solicitando token desde el contrato...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, simpleSwapAbi, signer);

    const tx = await contract.transferFromContract(tokenA, account, ethers.parseUnits("1", 18));
    await tx.wait();

    setStatus("✅ Token transferido a tu wallet desde el contrato");
  } catch (error) {
    console.error(error);
    setStatus("❌ Error al transferir token desde el contrato");
  }
}
  async function handleSwap() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, simpleSwapAbi, signer);

    const path = [tokenA, tokenB];
    const deadline = Math.floor(Date.now() / 1000) + 60;
    const amount = ethers.parseUnits(amountIn, 18);

    setStatus("Obteniendo cantidad estimada de salida...");
    const amountOutExpected = await contract.getAmountOutPublic(amount, tokenA, tokenB);

    const amountOutMin = amountOutExpected * 95n / 100n; // 5% slippage

    setStatus("Aprobando token para swap...");
    const tokenContract = new ethers.Contract(tokenA, erc20Abi, signer);
    const approveTx = await tokenContract.approve(contractAddress, amount);
    await approveTx.wait();

    setStatus("Realizando swap...");
    const tx = await contract.swapExactTokensForTokens(amount, amountOutMin, path, account, deadline);
    await tx.wait();

    setStatus("✅ Swap completado");
  } catch (err) {
    console.error(err);
    setStatus("❌ Error al hacer swap");
  }
}


async function fetchLiquidityInfo() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, simpleSwapAbi, provider);

    const total = await contract.getTotalLiquidity(tokenA, tokenB);
    const userLiq = await contract.getUserLiquidity(tokenA, tokenB, account);

    setTotalLiquidity(ethers.formatUnits(total, 18));
    setUserLiquidity(ethers.formatUnits(userLiq, 18));
  } catch (err) {
    console.error(err);
    setStatus("❌ Error al obtener la liquidez");
  }
}

  async function fetchPrice() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, simpleSwapAbi, provider);
      const result = await contract.getPrice(tokenA, tokenB);
      const formatted = ethers.formatUnits(result, 18);
      setPrice(formatted);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al obtener el precio");
    }
  }

  return (
    <div>
      <h3>Agregar Liquidez</h3>
      <input
        type="text"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        placeholder="Cantidad TokenA"
      />
       <input
        type="text"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        placeholder="Cantidad TokenB"
      />
      <button onClick={handleAddLiquidity}>Agregar Liquidez</button>
      <h3>Faucet desde contrato</h3>
      <button onClick={handleFaucet}>Recibir 1 TokenA</button>

      <h3>Swap TokenA → TokenB</h3>
      <input
        type="text"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        placeholder="Cantidad de TokenA"
      />
      <button onClick={handleSwap}>Hacer Swap</button>
      
      <h3>Precio actual</h3>
      <button onClick={fetchPrice}>Obtener precio</button>
      {price && <p>1 TokenA = {price} TokenB</p>}

      <p>{status}</p>

      <h3>Consultar Liquidez</h3>
      <button onClick={fetchLiquidityInfo}>Ver Liquidez</button>
      {totalLiquidity && <p>🔹 Liquidez total: {totalLiquidity} tokens</p>}
      {userLiquidity && <p>👤 Tu liquidez: {userLiquidity} tokens</p>}
    </div>
  );
}