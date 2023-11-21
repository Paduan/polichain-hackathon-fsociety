import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/MemberPortal.json"; 

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [transactionProcessed, setTransactionProcessed] = useState(false); // Estado para controlar a exibição do botão e da caixa de texto
  const contractAddress = "0xF5a22243ccFE8a241B8E134566A9140D2cd70cDd"; 
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account);
      } else {
        console.log("Nenhuma conta autorizada foi encontrada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask não encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const joinClub = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memberPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const joinTxn = await memberPortalContract.join(userMessage || "Membro anônimo");
        console.log("Processando transação...", joinTxn.hash);

        await joinTxn.wait();
        console.log("Transação processada:", joinTxn.hash);

        await getAllMembers(); // Atualiza a lista de membros
        setTransactionProcessed(true); // Atualiza o estado para esconder o botão e a caixa de texto
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const getAllMembers = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memberPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const members = await memberPortalContract.getAllMembers();
  
        let membersCleaned = [];
        members.forEach(member => {
          membersCleaned.push({
            address: member.member,
            timestamp: new Date(member.timestamp * 1000),
            message: member.message
          });
        });
  
        setAllMembers(membersCleaned);
      } else {
        console.log("Objeto Ethereum não existe!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          fsociety
        </div>
        <div className="conteudo">
          Have you ever felt like those in power manipulate the strings that control our lives? If you have, you're not alone. Welcome to fsociety.
        </div>

        {currentAccount && !transactionProcessed && (
          <>
            <div style={{ marginTop: "90px", display: 'flex', justifyContent: 'center' }}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="nick"
                style={{ margin: '0', padding: '6px', width: '50%', textAlign: 'center', fontSize: '17px' }}
              />
            </div>

            <button className="button-85" role="button" onClick={joinClub} style={{ display: 'block', margin: '20px auto' }}>
              join club
            </button>
          </>
        )}

        {allMembers.length > 0 && (
          <div style={{ backgroundColor: "#000000", marginTop: "16px", padding: "8px" }}>
            <div>Endereço: {allMembers[allMembers.length - 1].address}</div>
            <div>Tempo: {new Date(allMembers[allMembers.length - 1].timestamp).toString()}</div>
            <div>Nick: {allMembers[allMembers.length - 1].message}</div>
            <div>Total de Membros: {allMembers.length}</div>
            <a href="https://discord.gg/qMn4q9d8" style={{ color: '#ffffff' }}>Junte-se a nós no Discord</a>
          </div>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet} style={{ display: 'block', margin: '20px auto' }}>
            Conectar Carteira
          </button>
        )}
      </div>
    </div>
  );
}