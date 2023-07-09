import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerName, setOwnerName] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const getOwner = async() => {
    if(atm){
      let tx = await atm.getOwner();
      console.log("tx is : ", tx);
      setOwnerName(tx);

    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{height: "5vh", width: "20%", backgroundColor: "black", color: "white", borderRadius: "10px", cursor: "pointer", border: "0px",fontSize:"1rem"}}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <h2 style={{color: "black", fontFamily: "sans-serif"}}>Here are your details!</h2>
        <p style={{textDecoration: "underline"}}>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Owner Name: {ownerName}</p>

        <button style={{height: "4vh", width: "10%", margin: "5px 10px" ,backgroundColor: "green", color: "white", borderRadius: "5px", cursor: "pointer", border: "0px",fontSize:"1rem"}} onClick={deposit}>Deposit 1 ETH</button>
        <button style={{height: "4vh", width: "10%", margin: "5px 10px" ,backgroundColor: "red", color: "white", borderRadius: "5px", cursor: "pointer", border: "0px",fontSize:"1rem"}} onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet(); getOwner()}, []);

  return (
    <main className="container">
      <header><h1 style={{color: "red", fontFamily:"monospace"}}>Welcome to the UditVerse's ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}