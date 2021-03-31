import React, { useEffect, useState } from 'react';
import './App.css';
import web3 from './web3';
import { useWallet } from 'use-wallet';
import bamboov1 from './bamboov1';
import bamboov2 from './bamboov2';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function App() {

  const wallet = useWallet();
  const [v1Balance, setV1Balance] = useState('');
  const [v2Balance, setV2Balance] = useState('');
  const [allowance, setAllowance] = useState('');
  const bamboov2Address = '0x9a928D7dcD8D7E5Cb6860B7768eC2D87B8934267';

  const fetchV1Balance = async () => {
    let response = await bamboov1.methods.balanceOf(wallet.account).call();
    setV1Balance(web3.utils.fromWei(response, 'ether'));
  }

  const fetchV2Balance = async () => {
    let response = await bamboov2.methods.balanceOf(wallet.account).call();
    setV2Balance(web3.utils.fromWei(response, 'ether'));
  }

  const fetchAllowance = async () => {
    let response = await bamboov1.methods.allowance(wallet.account, bamboov2Address).call();
    setAllowance(web3.utils.fromWei(response, 'ether'));
  }

  useEffect(() => {
    if (wallet.status === 'connected') {
      fetchV1Balance();
      fetchV2Balance();
      fetchAllowance();
    }
  }, [wallet.status, v1Balance, v2Balance])

  const [approveAmount, setApproveAmount] = useState('');

  const onApprove = async () => {
    if (wallet.status === 'connected') {
      console.log("Approving....", approveAmount);
      try {
        await bamboov1.methods.approve(bamboov2Address, web3.utils.toWei(approveAmount, 'ether')).send({
          from: wallet.account
        });
        console.log("Approved!");
        alert(`${approveAmount} BAMBOO-V1 approved!`);
        fetchAllowance();
      } catch (err) {
        alert("Please input a valid numerical number!");
      }
    }
  }

  const handleApproveAmountChange = (event) => {
    console.log(event.target.value);
    setApproveAmount(event.target.value)
  }

  const onMaxApprove = () => {
    setApproveAmount(v1Balance);
  }

  const [convertAmount, setConvertAmount] = useState('');

  const handleConvertAmountChange = (event) => {
    setConvertAmount(event.target.value);
  }

  const onMaxConvert = () => {
    setConvertAmount(allowance);
  }

  const onConvert = async () => {
    if (wallet.status === 'connected') {
      console.log("Converting...", convertAmount);
      try {
        await bamboov2.methods.convertToV2(web3.utils.toWei(convertAmount, 'ether')).send({
          from: wallet.account
        });
        alert(`${convertAmount} BAMBOO-V1 converted to ${convertAmount} BAMBOO-V2! Please refresh the page!`);
        console.log("Converted!");
        fetchV2Balance();
      } catch (err) {
        alert(err);
      }
    }
  }

  return (
    <div class="App">
      <h1>BAMBOO-V1 to BAMBOO-V2 Converter</h1>
      <h2>Wallet</h2>
      {wallet.status === 'connected' ? (
        <>
          <Button variant="contained" color="primary" onClick={() => wallet.reset()}>Disconnect</Button>
        <div class="wallet-stats">
          <div>Account: {wallet.account}</div>
          <div>Balance: {web3.utils.fromWei(wallet.balance, 'ether')} AVAX</div>
          <div>BAMBOO-V1 Balance: {v1Balance}</div>
          <div>BAMBOO-V2 Balance: {v2Balance}</div>
        </div>
        <h2>Converter</h2>
          <p>First approve the BAMBOO-V2 contract to spend your BAMBOO-V1 tokens:</p>
          <div class="approve-group">
            <TextField variant="outlined" label="Approve amount" type="text" value={approveAmount} onChange={handleApproveAmountChange} />
            <Button variant="contained" onClick={onMaxApprove}>Max</Button>
            <Button variant="contained" color="primary" onClick={onApprove}>Approve</Button>
          </div>
          <div>Approved amount: {allowance}</div>
          <p>Then convert your BAMBOO-V1 tokens to BAMBOO-V2 tokens.</p>
          <p>Start with a small amount first for a better peace of mind :)</p>
          <div class="convert-group">
            <TextField variant="outlined" label="Convert amount" type="text" value={convertAmount} onChange={handleConvertAmountChange} />
            <Button variant="contained" onClick={onMaxConvert}>Max</Button>
            <Button variant="contained" color="primary" onClick={onConvert}>Convert</Button>
          </div>
        <h2>Troubleshooting</h2>
          <ul>
            <li>You must first approve before converting.</li>
            <li>The approved amount is the maximum you can convert. To convert more you have to approve more.</li>
            <li>The approved amount has an expiration time.</li>
            <li>Inputting non-numerical characters will result in errors.</li>
          </ul>
        </>
      ) : (
        <div>
          Connect:
          <Button variant="contained" color="primary" onClick={() => wallet.connect()}>MetaMask</Button>
        </div>
      )}
    </div>
  );
}

export default App;
