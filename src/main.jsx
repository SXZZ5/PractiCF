import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import Solve from './solve/Solve.jsx'
import './index.css'
import { makedb } from './idb/dbops.jsx'

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

export default GlobalWrapper;
