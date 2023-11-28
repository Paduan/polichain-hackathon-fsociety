import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/MemberPortal.json"; 

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [isMember, setIsMember] = useState(false); 
  const [transactionProcessed, setTransactionProcessed] = useState(false); 
  const contractAddress = "0x426145437D6C1bdF3a7C7d2D599E3e56f626a524"; 
  const contractABI = abi.abi;
  const [loading, setLoading] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");

  

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
        setLoading("Entrando no clube..."); // Inicia a mensagem de carregamento
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memberPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const joinTxn = await memberPortalContract.join(userMessage || "Membro anônimo");
        console.log("Processando transação...", joinTxn.hash);
  
        await joinTxn.wait();
        console.log("Transação processada:", joinTxn.hash);
  
        await getAllMembers(); // Atualiza a lista de membros
        setTransactionProcessed(true); // Atualiza o estado para esconder o botão e a caixa de texto
  
        setLoading(""); // Limpa a mensagem de carregamento
        setCompletionMessage("Concluída com sucesso"); // Exibe a mensagem de conclusão
        setTimeout(() => {
          setCompletionMessage(""); // Limpa a mensagem de conclusão após 5 segundos
        }, 5000);
      } else {
        console.log("Objeto Ethereum não encontrado!");
        setLoading("");
      }
    } catch (error) {
      console.log(error);
      setLoading(""); // Limpa a mensagem de carregamento em caso de erro
    }
  };

  const quitClub = async () => {
    if (!window.ethereum) return alert("Por favor, instale a MetaMask para usar este recurso!");
  
    try {
      setLoading("Saindo do clube..."); // Inicia a mensagem de carregamento
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const quitTxn = await contract.quit();
      console.log("Saindo do clube...", quitTxn.hash);
  
      await quitTxn.wait();
      console.log("Transação concluída. Hash:", quitTxn.hash);
  
      setLoading(""); // Limpa a mensagem de carregamento
      setCompletionMessage("Concluída com sucesso"); // Exibe a mensagem de conclusão
      setTimeout(() => {
        setCompletionMessage(""); // Limpa a mensagem de conclusão após 3 segundos
      }, 5000);
  
      setCurrentAccount("");
      setIsMember(false);
      setTransactionProcessed(false);
  
    } catch (error) {
      console.error("Erro ao sair do clube:", error);
      setLoading(""); // Limpa a mensagem de carregamento em caso de erro
    }
  
    setCurrentAccount(null);
    setIsMember(false);
    setAllMembers([]);
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

  const checkMembership = async () => {
    if (!currentAccount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    try {
      const memberStatus = await contract.isMember(currentAccount);
      setIsMember(memberStatus);
    } catch (error) {
      console.error("Erro ao verificar a associação", error);
    }
  };

  useEffect(() => {
    checkMembership(); 
    if (currentAccount && isMember) {
    getAllMembers();
  }
  }, [currentAccount, isMember]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          fsociety
        </div>
  
        {!currentAccount && (
          <>
            <div className="conteudo">
              Have you ever felt like those in power manipulate the strings that control our lives? If you have, you're not alone. Welcome to fsociety.
            </div>
            <button className="button-85" onClick={connectWallet} style={{ display: 'block', margin: '20px auto', marginTop: '150px' }}>
              Conectar Carteira
            </button>
          </>
        )}
  
        {currentAccount && !transactionProcessed && !isMember && (
          <>
            <div className="conteudo">
              let your journey begin
            </div>

            <div style={{ marginTop: "90px", display: 'flex', justifyContent: 'center' }}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="nickname"
                style={{ margin: '0', padding: '6px', width: '50%', textAlign: 'center', fontSize: '17px' }}
              />
            </div>

            <button className="button-85" role="button" onClick={joinClub} style={{ display: 'block', margin: '20px auto' }}>
              join club
            </button>
          </>
        )}
  
        {currentAccount && isMember && (
        <>
          <button className="glowing-btn" role="button" onClick={quitClub} style={{ display: 'block', margin: '50px auto' }}>
            Quit Club
          </button>
          <div style={{ color: '#ffffff', textAlign: 'center', marginTop: '20px' }}>
            Total de membros: {allMembers.length}
          </div>
        </>
      )}

        {currentAccount && allMembers.length > 0 && (
          <div style={{ backgroundColor: "#000000", marginTop: "16px", padding: "8px" }}>
            {allMembers.map((member, index) => (
              <div key={index}>
                <div>Endereço: {member.address}</div>
                <div>Horário: {new Date(member.timestamp).toString()}</div>
                <div>Nickname: {member.message}</div>
                {index < allMembers.length - 1 && <hr />}
              </div>
            ))}
            <div>Total de membros: {allMembers.length}</div>
            <a href="https://discord.gg/GQ97KmJbEX" style={{ color: '#ffffff' }}>Junte-se a nós</a>
          </div>
        )}

        {loading !== "" && (
          <div className="loadingContainer">
            <div className="loadingMessage">{loading}</div>
            <div className="loader"></div>
          </div>
        )}

        {completionMessage && (
          <div className="successContainer">
            <div className="successMessage">{completionMessage}</div>
            <svg className="checkmark success-animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="30" height="30">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        )}

      </div>
    </div>
  );
}