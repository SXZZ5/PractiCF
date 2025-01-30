import { Link } from "react-router";

export default function App(){
    return <div className="sk_modeChooseComponent">
        <Link to="/fetcher">
            <button className="button-15" role="button"> Go to fetch mode.</button>
        </Link>
        <Link to="/solve">
            <button className="button-15" role="button"> Go to solve mode. </button>
        </Link>
    </div>
}
