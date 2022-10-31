import { useEffect, useState } from "react";
import "./App.css";
import Task from "./Task.js"
import { ethers } from "ethers";
import Contract from "./utils/Task.json";
import React from 'react'
import { TextField, Button } from "@mui/material";
const ContractAddress = "cONTRACT DEPLOYED ADDRESS";


function App() {
  const [tasks, setTasks] = useState([]);
  const [CurrentAcc, setCurrenAcc] = useState("");
  const [CorrectNetwork, setCorrectNetwork] = useState(false);
  const [input, setInput] = useState("");


  const ConnectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask Not Detected");
      }
      let chainid = await ethereum.request({ method: "eth_chainId" });
      let RinkebyChainId = '0x4';
      if (chainid !== RinkebyChainId) {
        setCorrectNetwork(false);
        return;
      }
      else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      let account = accounts[0];
      setCurrenAcc(account);
      alert("Connection SuccesFull to:", account);
      console.log(account);
    } catch (error) {
      console.log(error);
    }
  }


  const addTask = async (e) => {
    e.preventDefault();
    let task =
    {
      "tasktext": input,
      "isdeleted": false,
    };
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoContract = new ethers.Contract(ContractAddress, Contract.abi, signer);
        await TodoContract.AddNewTask(task.tasktext, task.isdeleted).then(response => {
          setTasks(...tasks, task);
          console.log("New Task Added");
        })
      }
      else {
        console.log("Connect To metamask wallet")
      }
    } catch (error) {
      console.log(error)
    }
    setInput('');
  }
  const deleteTask = key => async () => {



    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoContract = new ethers.Contract(ContractAddress, Contract.abi, signer);
        await TodoContract.DeleteTasks(key, true);
        let alltasks = await TodoContract.getTasks();
        setTasks(alltasks);
      }
      else {
        console.log("Connect To metamask wallet")
      }
    } catch (error) {
      console.log(error)
    }

  }

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoContract = new ethers.Contract(ContractAddress, Contract.abi, signer);

        let alltasks = await TodoContract.getTasks();
        setTasks(alltasks);
      }
      else {
        console.log("Connect To metamask wallet")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    ConnectWallet();
    getAllTasks();
  }, [])
  return (
    <div>
      {CurrentAcc === '' ? (
        <button
          className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
          onClick={ConnectWallet}
        >
          Connect Wallet
        </button>
      ) : CorrectNetwork ? (
        <div className="App">
          <h2> Task Management App</h2>
          <form>
            <TextField id="outlined-basic" label="Make Todo" variant="outlined" style={{ margin: "0px 5px" }} size="small" value={input}
              onChange={e => setInput(e.target.value)} />
            <Button variant="contained" color="primary" onClick={addTask}  >Add Task</Button>
          </form>
          <ul>
            {tasks.map(item =>
              <Task
                key={item.id}
                tasktext={item.tasktext}
                onClick={deleteTask(item.id)}
              />)
            }
          </ul>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  )
}

export default App

