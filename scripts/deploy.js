const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando despliegue del contrato SimpleHomomorphicEncryption...");
  console.log(`📡 Red: ${hre.network.name}`);
  console.log(`⛓️  Chain ID: ${hre.network.config.chainId}`);
  
  // Obtenemos la cuenta del desplegador
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Desplegando desde la cuenta: ${deployer.address}`);
  
  // Verificamos el balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance de la cuenta: ${hre.ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    console.error("❌ Error: La cuenta no tiene fondos para pagar el gas");
    process.exit(1);
  }

  // Desplegamos el contrato
  console.log("\n📝 Desplegando contrato...");
  const SimpleHomomorphicEncryption = await hre.ethers.getContractFactory("SimpleHomomorphicEncryption");
  const contract = await SimpleHomomorphicEncryption.deploy();
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ Contrato desplegado exitosamente!");
  console.log(`📍 Dirección del contrato: ${contractAddress}`);
  console.log(`🔗 Verificar en Explorer:`);
  
  if (hre.network.name === "scroll" || hre.network.name === "scrollSepolia") {
    const explorer = hre.network.name === "scroll" 
      ? `https://scrollscan.com/address/${contractAddress}`
      : `https://sepolia.scrollscan.com/address/${contractAddress}`;
    console.log(`   ${explorer}`);
  } else if (hre.network.name === "arbitrum" || hre.network.name === "arbitrumSepolia") {
    const explorer = hre.network.name === "arbitrum"
      ? `https://arbiscan.io/address/${contractAddress}`
      : `https://sepolia.arbiscan.io/address/${contractAddress}`;
    console.log(`   ${explorer}`);
  }
  
  // Esperamos un poco antes de verificar (si es necesario)
  console.log("\n⏳ Esperando confirmaciones de bloque...");
  await contract.deploymentTransaction()?.wait(5);
  
  console.log("\n✨ Despliegue completado!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

