
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
    <div className="App">
    
      
      <button className='button-27' onClick={add}>Submit Verification</button> 

      {/* <p>uuid : {searchParams.get('uuid')}</p> */}
      
    </div>
  );
}

export default App;
