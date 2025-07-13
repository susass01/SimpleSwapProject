// test/SimpleSwapTest.cjs
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap contract", function () {
  let TokenA, TokenB, SimpleSwap;
  let tokenA, tokenB, simpleSwap;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    TokenA = await ethers.getContractFactory("ERC20Mock");
    tokenA = await TokenA.deploy("TokenA", "TKA", ethers.parseEther("1000"));
    await tokenA.waitForDeployment();

    TokenB = await ethers.getContractFactory("ERC20Mock");
    tokenB = await TokenB.deploy("TokenB", "TKB", ethers.parseEther("1000"));
    await tokenB.waitForDeployment();

    SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwap.deploy();
    await simpleSwap.waitForDeployment();

    await tokenA.transfer(addr1.address, ethers.parseEther("100"));
    await tokenB.transfer(addr1.address, ethers.parseEther("100"));
  });

  it("Debe agregar liquidez correctamente", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);

    await expect(simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    )).to.emit(simpleSwap, "LiquidityAdded");
  });

  it("Debe revertir si el deadline expiró", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);

    await expect(simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) - 10
    )).to.be.revertedWith("Transaction expired");
  });

  it("Debe hacer swap correctamente", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);
    await simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    );

    const swapAmount = ethers.parseEther("1");
    await tokenA.connect(addr1).approve(simpleSwap, swapAmount);

    const [resA, resB] = await simpleSwap.getPrice(tokenA, tokenB);
    const amountOutExpected = await simpleSwap.getAmountOut(swapAmount, resA, resB);
    const amountOutMin = amountOutExpected * 95n / 100n;

    await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
      swapAmount, amountOutMin, [tokenA, tokenB], addr1.address, Math.floor(Date.now() / 1000) + 60
    )).to.emit(simpleSwap, "TokensSwapped");
  });

  it("Debe revertir swap si slippage es muy alto", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);
    await simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    );

    const swapAmount = ethers.parseEther("1");
    await tokenA.connect(addr1).approve(simpleSwap, swapAmount);

    const amountOutMin = ethers.parseEther("5"); // exagerado

    await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
      swapAmount, amountOutMin, [tokenA, tokenB], addr1.address, Math.floor(Date.now() / 1000) + 60
    )).to.be.revertedWith("Insufficient output amount");
  });

  it("Debe permitir remover liquidez", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);
    await simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    );

    const liquidity = await simpleSwap.getUserLiquidity(tokenA, tokenB, addr1.address);

    await expect(simpleSwap.connect(addr1).removeLiquidity(
      tokenA, tokenB, liquidity, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    )).to.emit(simpleSwap, "LiquidityRemoved");
  });

  it("Debe revertir si usuario intenta remover más liquidez de la que posee", async function () {
    const excess = ethers.parseEther("100");
    await expect(simpleSwap.connect(addr1).removeLiquidity(
      tokenA, tokenB, excess, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    )).to.be.revertedWith("Insufficient liquidity");
  });

  it("Debe retornar precio y cantidad out", async function () {
    const amount = ethers.parseEther("10");
    await tokenA.connect(addr1).approve(simpleSwap, amount);
    await tokenB.connect(addr1).approve(simpleSwap, amount);
    await simpleSwap.connect(addr1).addLiquidity(
      tokenA, tokenB, amount, amount, 0, 0, addr1.address, Math.floor(Date.now() / 1000) + 60
    );

    const price = await simpleSwap.getPrice(tokenA, tokenB);
    expect(price).to.be.gt(0);

    const amountOut = await simpleSwap.getAmountOutPublic(
      ethers.parseEther("1"), tokenA, tokenB
    );
    expect(amountOut).to.be.gt(0);
  });

  it("Debe revertir getPrice si no hay liquidez", async function () {
    await expect(simpleSwap.getPrice(tokenA, tokenB)).to.be.revertedWith("No liquidity");
  });
});
