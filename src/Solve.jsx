import { useEffect, useState } from "react";
import { activePsets } from "./dbops";
import { Link } from "react-router-dom";
import './Solve.css'


export default function Solvemode() {

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
    }, [])

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
                    return <PsetButton key={x.rangeName} pset={x} />
                })}
            </div>
        </div>
    }
}

function PsetButton({ pset }) {
    console.log("Psetbutton called");
    console.log(pset);
    return <div>
        <button className="button-15" role="button">
            <Link to={`/solve/${pset.rangeName}`}>
                {pset.rangeName}
            </Link>
        </button>
    </div>
}