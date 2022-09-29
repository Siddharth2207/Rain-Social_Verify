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


    let role = await verifyContract.state(await provider.getSigner().getAddress())
    console.log(role)
    var enc = new TextEncoder() 
    let bytes = enc.encode(searchParams.get('uuid')) 

    let tx = await verifyContract.add(bytes , {
              gasPrice : ethers.utils.parseUnits('350', 'gwei'),
              gasLimit :  '200000'
          }) 

    let reuslt = await tx.wait()
     console.log(reuslt )  

     let verifyReq = await axios.post('http://localhost:5000/api/v2/verify' , {
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
            Rain Game Verification
          </h1>
        </div>
      </div> 
        <div class="text-center mb-5">
          <button className='btn btn-secondary' onClick={add}>Submit Verification</button> 
        </div>

      <div className='row mb-3'>
        <div className='col-lg-12'>
          <h3 className='fw-semibold'>
            How does this work?
          </h3>
        </div>
        <ol class="list-group list-group-numbered text-left">
          <li class="list-group-item border-0">A list item</li>
          <li class="list-group-item border-0">A list item</li>
          <li class="list-group-item border-0">A list item</li>
        </ol>
      </div>
      
    </div>
    </div>
  
  );
}

export default App;