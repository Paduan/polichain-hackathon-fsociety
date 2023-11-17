require("@nomicfoundation/hardhat-toolbox");

// Insira a chave privada da sua conta Ethereum aqui (não compartilhe esta chave!)
const privateKey = "2d85d93a34ddfa3ff47045fe064310e3d9e45acbc917ae21c99b479b161c0569";

module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/7hbRn6ymMVvl-me_jXf_745pzt6lJet_", // Substitua com sua URL do Infura/Alchemy
      accounts: [`0x${privateKey}`]
    }
  }
};