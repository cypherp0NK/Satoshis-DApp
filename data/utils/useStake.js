import SATStaking from "../static/SATStaking.json";
import StandardERC20 from "../static/StandardERC20.json";
import { formatUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ConnectionData from "@/hooks/ConnectionData";
import { useState } from "react";

export default function useStake() {
  const web3Modal =
    typeof window !== "undefined" && new Web3Modal({ cacheProvider: true });
  const { stakingAddress, tokenAddress } = ConnectionData();
  const { abi } = SATStaking;
  const tokenABI = StandardERC20.abi;
  const [stakeError, setStakeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [approveHash, setApproveHash] = useState("");
  const [stakeHash, setStakeHash] = useState("");

  const stake = async (amount, duration) => {
    setLoading(true);
    try {
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      //APPROVE
      const signer = provider.getSigner();
      const web3Address = await signer.getAddress();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI,
        provider
      );
      const allowedAmount = await tokenContract.allowance(
        web3Address,
        stakingAddress
      );
      const simplifiedAllowance = parseFloat(
        formatUnits(allowedAmount, 9)
      ).toFixed(3);

      if (simplifiedAllowance < amount) {
        const approveAmount = ethers.utils.parseUnits(
          (amount - simplifiedAllowance).toString(),
          9
        );
        const makeApproval = new ethers.Contract(
          tokenAddress,
          tokenABI,
          provider.getSigner()
        );
        makeApproval
          .approve(stakingAddress, approveAmount.toString())
          .then((tx) => {
            provider.waitForTransaction(tx.hash).then(() => {
              setLoading(false);
              setApproveHash("https://etherscan.io/tx/".concat(tx.hash));
            });
          })
          .catch((error) => {
            setLoading(false);
            const e = error.message.search("message");
            setStakeError(error.message.slice(0, 25).concat("..."));
          });
      }

      // //STAKE
      else {
        const StakingContract = new ethers.Contract(
          stakingAddress,
          abi,
          provider.getSigner()
        );
        const amountAsWei = ethers.utils.parseUnits(amount.toString(), 9);

        StakingContract.stakeSatoshisVision(amountAsWei.toString(), duration)
          .then((tx) => {
            provider.waitForTransaction(tx.hash).then(() => {
              setLoading(false);
              setStakeHash("https://etherscan.io/tx/".concat(tx.hash));
            });
          })
          .catch((error) => {
            setLoading(false);
            const e = error.message.search("message");
            setStakeError(error.message.slice(0, 25).concat("..."));
          });
      }
    } catch (error) {
      setLoading(false);
      const e = error.message.search("message");
      setStakeError(error.message.slice(0, 25).concat("..."));
    }
  };

  const matureUnstake = async (addr, arraySlot) => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const StakingContract = new ethers.Contract(
      stakingAddress,
      abi,
      provider.getSigner()
    );

    StakingContract.matureUnstake(addr, arraySlot)
      .then((tx) => {
        provider.waitForTransaction(tx.hash).then(() => {
          setStakeHash("https://etherscan.io/tx/".concat(tx.hash));
        });
      })
      .catch((error) => {
        setLoading(false);
        const e = error.message.search("message");
        setStakeError(error.message.slice(0, 25).concat("..."));
      });
  };

  const unstake = async (arraySlot) => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const StakingContract = new ethers.Contract(
      stakingAddress,
      abi,
      provider.getSigner()
    );

    StakingContract.unstake(arraySlot)
      .then((tx) => {
        provider.waitForTransaction(tx.hash).then(() => {
          setStakeHash("https://etherscan.io/tx/".concat(tx.hash));
        });
      })
      .catch((error) => {
        setLoading(false);
        const e = error.message.search("message");
        setStakeError(error.message.slice(0, 25).concat("..."));
      });
  };

  const enterLobby = async (ethAmt, referrer) => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const StakingContract = new ethers.Contract(
      stakingAddress,
      abi,
      provider.getSigner()
    );

    const refAddr =
      referrer === "" ? "0x0000000000000000000000000000000000000000" : referrer;
    const ethToWei = ethers.utils.parseUnits(ethAmt.toString(), 18);
    StakingContract.enterLobby(refAddr, { value: ethToWei })
      .then((tx) => {
        provider.waitForTransaction(tx.hash).then(() => {
          setStakeHash("https://etherscan.io/tx/".concat(tx.hash));
        });
      })
      .catch((error) => {
        setLoading(false);
        const e = error.message.search("message");
        setStakeError(error.message.slice(e + 30, e + 51).concat("..."));
      });
  };

  const exitLobby = async (entryDay) => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const StakingContract = new ethers.Contract(
      stakingAddress,
      abi,
      provider.getSigner()
    );

    StakingContract.exitLobby(entryDay - 1)
      .then((tx) => {
        provider.waitForTransaction(tx.hash).then(() => {
          setStakeHash("https://etherscan.io/tx/".concat(tx.hash));
        });
      })
      .catch((error) => {
        setLoading(false);
        const e = error.message.search("message");
        setStakeError(error.message.slice(0, 300).concat("..."));
      });
  };

  return {
    stake,
    matureUnstake,
    unstake,
    enterLobby,
    exitLobby,
    loading,
    setLoading,
    approveHash,
    stakeHash,
    setApproveHash,
    setStakeHash,
    stakeError,
    setStakeError,
  };
}
