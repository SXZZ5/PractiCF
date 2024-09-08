import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Solve from './Solve.jsx'
import './index.css'
import { makedb } from './dbops.jsx'

makedb();

function GlobalWrapper(){
    const [mode, modeSetter] = useState(true);
    //true => for fetching mode and false for solving mode.

    if(mode){
        return <App modeSetter={modeSetter}/>
    } else {
        return <Solve />
    }
}

createRoot(document.getElementById('root')).render(
    <GlobalWrapper />
)
