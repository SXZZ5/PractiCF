import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Fetchmode from "../fetcher/Fetchmode";
import Solvemode from "../solve/Solve";
import Pset from "../pp/Pset";
import ProblemPage from "../pp/ProblemPage";

export default function App(){
    const router = createBrowserRouter([
        {
            path: "/",
            element: <ModeChooseComponent />,
        },
        {
            path: "/fetcher",
            element: <Fetchmode />
        },
        {
            path: "/solve",
            element: <Solvemode />
        },
        {
            path: "/solve/:rangeName",
            element: <Pset />,
            children: [{
                path: "/solve/:rangeName/:probId",
                element: <ProblemPage />
            }]
        }
    ])

    return <>
        <RouterProvider router={router} />
    </>
}

function ModeChooseComponent(){
    return <div className="sk_modeChooseComponent">
        <Link to="/fetcher">
            <button className="button-15" role="button"> Go to fetch mode.</button>
        </Link>
        <Link to="/solve">
            <button className="button-15" role="button"> Go to solve mode. </button>
        </Link>
    </div>
}
