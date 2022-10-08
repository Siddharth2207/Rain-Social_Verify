
import './App.css'; 
import {EmissionsERC20} from "rain-sdk" 
import { useEffect,useState } from 'react';
import { ethers } from 'ethers';  
import axios from "axios" 
import {
  useSearchParams
} from "react-router-dom"


function App() {  

  const [input , setInput] = useState('')
  const [selectVal , setSelectVal] = useState('Register')
  const [verifyContract , setVerifyContract] = useState('') 
  const [provider , setProvider] = useState('') 
  const [address , setAddress] = useState('') 
  const [balance , setBalance] = useState('')  
  const [decimals , setDecimals] = useState('')  
  const [searchParams] = useSearchParams();  
  const [claim , setClaim] = useState('0'); 
  const [flag , setFlag] = useState(false); 


  // console.log(searchParams.get('uuid'))
 

  useEffect(() => {  
    async function fetchData(){
      if (window.ethereum) {  
        window.ethereum.enable() 
        
        let providerObject  = new ethers.providers.Web3Provider(window.ethereum)  
        setProvider(providerObject) 
        let signer = providerObject.getSigner()
        let verifyContractObject = new EmissionsERC20('0x8fbf820107b88a54714ebe6debc26547ce31d914', signer)  
        setVerifyContract(verifyContractObject) 
        let address = await signer.getAddress()
        setAddress(address)
        // setDecimals(dec)
        
      } 
    }
    fetchData()
    test()
  } , [])  

  const test = async () => { 

    let address = await provider.getSigner().getAddress()  
    let res = await verifyContract.balanceOf(address)
    let dec = await verifyContract.decimals()
    setBalance(res.toString())
    // setBalance(ethers.utils.parseUnits(res.toString(), dec))
    // console.log(ethers.utils.parseUnits(res.toString(), dec).toString())

  }

  const submit  = async () => {   

    console.log('input : ' , input) 
    console.log("select", selectVal)
    let id = input.split('/').pop() 
    console.log(id) 
    let verifyReq 
  
    if(selectVal.toLowerCase() == 'register'){
      verifyReq = await axios.post('http://localhost:5000/api/v2/registerChessId' , {
        tweetId :  id
      })  
      
    }else if(selectVal.toLowerCase() == 'verify game'){
      let address = await provider.getSigner().getAddress()  

      verifyReq = await axios.post('http://localhost:5000/api/v2/chessGame' , {
        tweetId :  id ,
        address : address.toLowerCase()
      })   
    }

    setClaim(verifyReq.data.data.gameTokens)
    setFlag(true)
  }  

  // const verifyGame  = async () => {   
    
  //   let address = await provider.getSigner().getAddress()  

  //   console.log('input : ' , input) 
  //   let id = input.split('/').pop() 
  //   console.log(id)  


  //   let verifyReq = await axios.post('http://localhost:5000/api/v2/chessGame' , {
  //     tweetId :  id ,
  //     address : address.toLowerCase()
  //    })   

  //   setClaim(verifyReq.data.data.gameTokens)
  //   setFlag(true)

  // } 

  const claimCall  = async () => {   
      let address = await provider.getSigner().getAddress() 
      console.log(address)

      let tx = await verifyContract.claim( address ,ethers.constants.AddressZero , {
        gasPrice : ethers.utils.parseUnits('350', 'gwei'),
        gasLimit :  '200000'
    })  

    let reuslt = await tx.wait()
    console.log(reuslt )  
    

    setClaim('0')
    setInput('')
    setSelectVal('')
    setFlag(false)

  }


  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="assets/images/favicon.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
            <span className='ps-3 fw-bolder'>Rain Game Engine</span>
          </a>
          <span class="navbar-text pe-3">
          <span className="rounded-pill bg-secondary text-white fw-semibold px-3 py-2">
            {/* ${ethers.utils.parseUnits(balance.toString(), decimals)} */}
           {`${address.slice(0, 6) + "..." + address.slice(address.length - 4, address.length)} - ${balance}`}
           </span>
          </span>
        </div>
      </nav>
      <div style={{height: "90vh"}} className='d-flex justify-content-center align-items-center'>
      <div className="w-75 px-3">
        <div className='row mb-3'>
          <div className='col-lg-12'>
            <h1 className='text-center fw-semibold'>
              <img src='assets/images/favicon.png' width='40' height='40' alt='twitter' className='me-4' />
              Rain Game Claim Tokens
            </h1>
          </div>
        </div>  

      
          <div className="input-group mb-5 me-5 px-5">
            <input type="text" className="form-control" style={{width: '70%'}} onChange={e => setInput(e.target.value)} placeholder ="Tweet URL" ></input>
            <select className="form-select" style={{width: '20%'}} value={selectVal} onChange={e => setSelectVal(e.target.value)}>
                <option value="Register">Register</option>
                <option value="Verify Game">Verify Game</option>
            </select>
            <button className='btn btn-secondary' style={{width: '10%'}} onClick={submit} disabled={!input}>Submit</button>  
            {/* <button className='btn btn-secondary' onClick={verifyGame} disabled={!input}>Verify Game</button> 
            <button className='btn btn-secondary' onClick={test} disabled={!input}>Test</button>  */}
          </div>
          {
            flag && (
              <div className="mb-5 me-5 px-5">
                <div className="mb-3">Claimable Amount : {claim} MyTKN</div>
                <button className='btn btn-secondary' onClick={claimCall}>Claim</button>
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
          <div className=' d-flex align-items-center'>
              <img src='assets/images/lichess.svg' width='40' height='40' alt='twitter' className='me-4' />
              <p>
              Verify via Twitter, make a <a target='_blank' href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).<br />
    Copy-paste the tweets URL into the above input box and fire away!
              </p>
          </div>
        </div>
        
      </div>
      </div>
    </>
  );
}

export default App;


