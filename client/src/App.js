import react from 'react'
import Register from './RegisterAndLoginForm.js'
import axios from 'axios'
import { UserContextProvider } from './context/UserContext.jsx';
import Routes from './Routes.js'

function App() {
  // axios.defaults.baseURL = 'http://localhost:4000/api/';
  // axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
      
   
  );
}

export default App;
