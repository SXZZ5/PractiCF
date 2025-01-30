import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import Solve from './solve/Solve.jsx'
import Fetchmode from './fetcher/Fetchmode.jsx'
import Solvemode from './solve/Solve.jsx'
import Pset from './pp/Pset.jsx'
import ProblemPage from './pp/ProblemPage.jsx'
import './index.css'
import { makedb } from './idb/dbops.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

makedb();

function GlobalWrapper() {
    const [mode, modeSetter] = useState(true);
    //true => for fetching mode and false for solving mode.

    if (mode) {
        return <App modeSetter={modeSetter} />
    } else {
        return <Solve />
    }
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/fetcher" element={<Fetchmode />}></Route>
            <Route path="/solve" element={<Solvemode />}></Route>
            <Route path="/solve/:rangeName" element={<Pset />}></Route>
            <Route path="/solve/:rangeName/:probId" element={<ProblemPage />}></Route>
        </Routes>
    </BrowserRouter>
    // <GlobalWrapper />
)

export default GlobalWrapper;
