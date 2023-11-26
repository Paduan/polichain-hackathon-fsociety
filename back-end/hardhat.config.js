require("@nomicfoundation/hardhat-toolbox");

const privateKey = "2d85d93a34ddfa3ff47045fe064310e3d9e45acbc917ae21c99b479b161c0569";

module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/NW86baOkDao8XyHxTzV25h96Z2J8BKtW", // Substitua com sua URL do Alchemy
      accounts: [`0x${privateKey}`]
    }
  }
};