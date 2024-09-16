import { useEffect, useState } from "react";
import { activePsets, DeletePset } from "./dbops";
import { Link } from "react-router-dom";
import './Solve.css'


export default function Solvemode() {

    const [trigger, setTrigger] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    console.log(data);
    console.log(isLoading);

    useEffect(() => {
        activePsets()
            .then((z) => {
                console.log("activePset promise resolved");
                console.log(z);
                setData((prev) => z)
                setisLoading((prev) => false)
            })
            .catch((z) => {
                console.log(z);
            })
    }, [trigger])

    if (isLoading) {
        return <>
            Brb. Loading data.
        </>
    } else {
        console.log(data);
        return <div>
            <div className="flex text-4xl font-bold flex-wrap justify-center align-center top-11">
               ACTIVE PSETS. 
            </div>
            <div className="sk_solvepage">
                {data.map((x) => {
                    console.log(x);
                    return <PsetButton key={x.rangeName} pset={x} setTrigger={setTrigger}/>
                })}
            </div>
        </div>
    }
}

function PsetButton({ pset, setTrigger }) {
    console.log("Psetbutton called");
    console.log(pset);

    const handleOnClick = () => {
        DeletePset(pset.rangeName);
        setTrigger((prev) => !prev);
    }

    return <div className="flex flex-wrap gap-1">
        <button className="button-15" role="button">
            <Link to={`/solve/${pset.rangeName}`}>
                {pset.rangeName}
            </Link>
        </button>
        <button className="icon-button" onClick={handleOnClick}>
            <span class="icon">x</span>
        </button>
    </div>
}