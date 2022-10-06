
import './App.css'; 
import {Verify} from "rain-sdk" 
import { useEffect,useState } from 'react';
import { ethers } from 'ethers';  
import axios from "axios" 
import {
  useSearchParams
} from "react-router-dom"


function App() {  

  const [input , setInput] = useState('')
  const [verifyContract , setVerifyContract] = useState('') 
  const [provider , setProvider] = useState('') 
  const [address , setAddress] = useState('')  
  const [searchParams] = useSearchParams();  
  const [claim , setClaim] = useState(); 
  const [flag , setFlag] = useState(false); 


  // console.log(searchParams.get('uuid'))
 

  useEffect(() => {  

    if (window.ethereum) {  
      window.ethereum.enable() 
      
      let providerObject  = new ethers.providers.Web3Provider(window.ethereum)  
      setProvider(providerObject) 
      let signer = providerObject.getSigner()
      let verifyContractObject = new Verify('0x59144e51afb64f3889a404f19caf632c83bb6105', signer)  
      setVerifyContract(verifyContractObject) 
      // let address = await signer.getAddress() 
      // console.log(address)
      
    } 
  } , []) 

  const add  = async () => { 
    setFlag(true)

  }

  return (
    <div className=' vh-100 d-flex justify-content-center align-items-center'>
    <div className="w-75 px-3">
      <div className='row mb-3'>
        <div className='col-lg-12'>
          <h1 className='text-center fw-semibold'>
            <img src='assets/images/twitter.png' width='40' height='40' alt='twitter' className='me-4' />
            Rain Game Claim Tokens
          </h1>
        </div>
      </div> 
        <div className="input-group mb-5 me-5 px-5">
          <input type="text" class="form-control" onChange={e => setInput(e.target.value)} placeholder ="Tweet URL" ></input>
          <button className='btn btn-secondary' onClick={add} disabled={!input}>Submit</button> 
        </div>
        {
          flag && (
            <div className="mb-5 me-5 px-5">
              <div className="mb-3">Mintable amount will be 0.0 MyTKN</div>
              <button className='btn btn-secondary' onClick={add}>Claim</button>
            </div>
          )
        }

      <div className='row mb-3'>
        <div className='col-lg-12'>
          <h3 className='text-left fw-semibold'>
            How does this work?
          </h3>
        </div>
        <div className=' d-flex align-items-center'>
            <img src='assets/images/twitter.png' width='32' height='32' alt='twitter' className='me-4' />
            <p>
            Verify via Twitter, make a <a target='_blank' href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).<br />
  Copy-paste the tweets URL into the above input box and fire away!
            </p>
        </div>
      </div>
      
    </div>
    </div>
  );
}

export default App;


