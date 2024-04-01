import {React,useState,useEffect,useContext,useRef} from 'react'
import Avatar from './Avatar.js'
import Contact from './Contact.js'
import Logo from './Logo.js'
import { UserContext } from './context/UserContext.jsx'
import {uniqBy} from 'lodash'
import axios from 'axios'
  
export default function Chat() {
    const [ws,setWs] = useState(null)
     const [onlinePeople,setOnlinePeople] = useState({})
     const [offlinePeople,setOfflinePeople] = useState({})
     const [selectedUserId,setselectedUserId] = useState(null)
     const [newMessageText,setnewMessageText] = useState('')
     const [messages,setMessages] = useState([])
      const chatContainerRef = useRef(null);

     const {username,id,setId,setUsername} = useContext(UserContext)

       const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const logout = async()=>{
    await axios.post(`http://localhost:4000/api/auth/logout`,{withCredentials:true}).then(
      ()=>{
         setId(null)
         setUsername(null)
      }
    )
  }


  const handleMessage = (ev)=>{

        const messageData = JSON.parse(ev.data)
        console.log({ev,messageData})
        if('online' in messageData){
          showOnlinePeople(messageData.online)
        }
       else if('text' in messageData){
          setMessages(prev => ([...prev ,{ ...messageData}]))
        } 
      }
    
 useEffect(() => {
    scrollToBottom();
  }, [messages]);


    useEffect(()=>{
     // Fetch cookies from browser
      // const cookie = document.cookie;
      setTimeout(()=>{
          connectTows()
      },1000)
   
 
    },[])

      
    const connectTows = ()=>{
        const ws = new WebSocket('ws://localhost:4000');
       setWs(ws);
      ws.addEventListener('message',handleMessage)
       ws.addEventListener('close',()=>{
         connectTows()
      })
    }

    const showOnlinePeople = (peopleArray)=>{
       let people = {}
      peopleArray.forEach(({userId,username})=>{
         people[userId] = username
      })
    //  console.log(people)
      setOnlinePeople(people)

      
    }
   
   const sendMessage = (e) => {
  e.preventDefault();
  
  //console.log('Sending message:', message); // Log the message before sending
  ws.send(JSON.stringify({ 
    recipient: selectedUserId,
    text: newMessageText
   }));
   setnewMessageText('')
   setMessages(prev => ([...prev ,
    {
      text : newMessageText,
     sender:id,
     recipient:selectedUserId,
     _id : Date.now()
    }]))
};

useEffect(()=>{
  axios.get(`http://localhost:4000/api/message/people`,{withCredentials:true}).then(res=>{
     const offlinePeopleArr = res.data
     .filter(p => p._id !== id)
     .filter(p => !Object.keys(onlinePeople).includes(p._id))

     const offlinePeople = {}
     offlinePeopleArr.forEach(p=> {
        offlinePeople[p._id] = p
     })
  //  console.log(offlinePeople)
     setOfflinePeople(offlinePeople)
    
     
  })
},[onlinePeople])

useEffect(()=>{
  if(selectedUserId){
   axios.get(`http://localhost:4000/api/message/messages/${selectedUserId}`,{withCredentials:true}).then(res=>{
          setMessages(res.data)
   })
  }
  
},[selectedUserId])


   const  onlinePeopleExclOurUser = {...onlinePeople}
      delete onlinePeopleExclOurUser[id]
    

      const messagesWithoutDupes = uniqBy(messages,'_id')
    //  console.log(messagesWithoutDupes)
  return (
    <div className = 'flex h-screen'>
       <div className = "bg-white w-1/3 pl-4 pt-4 flex flex-col ">
           <div className = 'flex-grow'> 
                 <Logo/>
            {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => {setselectedUserId(userId);console.log({userId})}}
              selected={userId === selectedUserId} />
          ))}
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setselectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))}

           </div>
           
          <div className = "p-4  flex gap-2 justify-center items-center"> 
            <span className = "">Welcome! {username}</span>
            <button onClick = {logout}
            className = "text-sm text-gray-400  bg-blue-100 py-2 px-3 border rounded-sm">logout</button>
          </div>
      
       </div>
       
       <div className = "flex flex-col bg-blue-100 w-2/3 pt-3">

         <div className = "flex-grow "> 
         {!selectedUserId && (
          <div className = "h-full flex justify-center items-center"> 
                 <div className = "text-gray-400">
                    Select the person from the sidebar
                </div>
          </div>
         )}

         {selectedUserId && (
         <div className="relative h-full">
   <div ref={chatContainerRef} className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
    {messagesWithoutDupes.map((message, index) => (
      <div key={index} className={"mx-10 " + (message.sender === id ? 'text-right ' : 'text-left ')}>
        <div className={"inline-block p-2 m-3 rounded-lg " + (message.sender === id ? 'bg-blue-600 text-white' : 'bg-white text-black-500')}>
          {message.text}
        </div>
      </div>
    ))}
  </div>
</div>

         )}
         </div>
   {selectedUserId && (
           <form className = "flex gap-2 mb-2"  onSubmit = {sendMessage}>
             <input type = "text" 
             value = {newMessageText}
             onChange = {(e)=>setnewMessageText(e.target.value)}
           placeholder = "Type your message here"
           className = "bg-white-border p-2 flex-grow"
         />
         <button type = 'submit' className = "bg-blue-500 text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>

         </button>
         </form>
   )}
      
        </div>
    </div>
  )
}
  