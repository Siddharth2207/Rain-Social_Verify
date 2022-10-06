
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

    console.log('input : ' , input) 
    let id = input.split('/').pop() 
    console.log(id) 

    let role = await verifyContract.state(await provider.getSigner().getAddress())
    console.log(role)
    var enc = new TextEncoder() 
    let bytes = enc.encode(id) 

    let tx = await verifyContract.add(bytes , {
              gasPrice : ethers.utils.parseUnits('350', 'gwei'),
              gasLimit :  '200000'
          }) 

    let reuslt = await tx.wait()
     console.log(reuslt )  

     let verifyReq = await axios.post('http://localhost:5000/api/v2/verify-twitter' , {
      hash :  reuslt.transactionHash
     }) 

     if(verifyReq.data.status){
      alert("Address verified ")
     }

  }

  return (
    <div className=' vh-100 d-flex justify-content-center align-items-center'>
    <div className="w-75 px-3">
      <div className='row mb-3'>
        <div className='col-lg-12'>
          <h1 className='text-center fw-semibold'>
            <img src='assets/images/twitter.png' width='40' height='40' alt='twitter' className='me-4' />
            Rain Game Verification
          </h1>
        </div>
      </div> 
        <div class="input-group mb-5 me-5 px-5">
          <input type="text" class="form-control" onChange={e => setInput(e.target.value)} placeholder ="Tweet URL" ></input>
          <button className='btn btn-secondary' onClick={add} disabled={!input}>Submit Verification</button> 
        </div>

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


