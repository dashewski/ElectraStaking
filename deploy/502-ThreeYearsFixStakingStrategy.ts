import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { AddressBook__factory, FixStakingStrategy__factory } from '../typechain-types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy, get, getOrNull } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]
  
  const FixStakingStrategyImplementationDeployment = await get('FixStakingStrategyImplementation')
  const AddressBookDeployment = await get('AddressBook')


  const alreadyDeployed = await getOrNull('ThreeYearsFixStakingStrategy') != null
  if(alreadyDeployed) return

  const deployment = await deploy('ThreeYearsFixStakingStrategy', {
    contract: 'ERC1967Proxy',
    from: deployer.address,
    args: [
      FixStakingStrategyImplementationDeployment.address,
      FixStakingStrategy__factory.createInterface().encodeFunctionData('initialize', [
        AddressBookDeployment.address, // _addressBook
        1000, // _rewardsRate
        3, // _lockYears
        0, // _yearDeprecationRate
      ])
    ]
  })

  const addressBook = AddressBook__factory.connect(AddressBookDeployment.address, deployer)
  await (await addressBook.addStakingStrategy(deployment.address)).wait(1)
}

deploy.tags = ['ThreeYearsFixStakingStrategy']
deploy.dependencies = ['TwoYearsFixStakingStrategy']
export default deploy
