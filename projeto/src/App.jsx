import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";


export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x99a3eF186cEee6D1ef3E89fb355837F7F576aF6F";
  const contractABI = abi.abi;

  /*
   * Método para consultar todos os tchauzinhos do contrato
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Chama o método getAllWaves do seu contrato inteligente
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Armazenando os dados
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * Você está usando o contractABI aqui
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de tchauzinhos...", count.toNumber());

        const messageToSend = userMessage || "esta e uma mensagem padrao"; // Mensagem padrão se não houver mensagem personalizada

        const waveTxn = await wavePortalContract.wave(messageToSend);
        console.log("Minerando...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de tchauzinhos recuperado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          fsociety
        </div>
        <div className="conteudo">
          Have you ever felt like that those in power manipulate the strings that control our lives? If you have, you're not alone. Welcome to fsociety
        </div>

        {/* Verifica se há uma conta conectada antes de exibir o botão "Mandar Tchauzinho" e o campo de mensagem */}
        {currentAccount && (
          <>
            

            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="your id"
              style={{ margin: '20px', padding: '6px', textAlign: 'center', font: 'teste',}} 
            />
            

            
            <button class="button-85" role="button" onClick={wave} >join club</button>
              
            
          </>
        )}

        {/* Se não existir uma conta conectada, exibe o botão para conectar a carteira */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
    </div>
  );
}