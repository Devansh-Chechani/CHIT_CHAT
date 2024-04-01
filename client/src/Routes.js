import {useContext} from 'react'
import {UserContext} from './context/UserContext.jsx'
import RegisterAndLoginForm from './RegisterAndLoginForm.js'
import Chat from './Chat.js'

export default function Routes() {

  const {username} = useContext(UserContext)

     if(username)return <Chat/>
  return (
    <RegisterAndLoginForm/>
  )
}
