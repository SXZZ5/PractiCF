import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Fetchmode from "./Fetchmode";
import Solvemode from "./Solve";
import Pset from "./Pset";
import ProblemPage from "./ProblemPage";

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
    return <div class="sk_modeChooseComponent">
        <Link to="/fetcher">
            <button class="button-15" role="button"> Go to fetch mode.</button>
        </Link>
        <Link to="/solve">
            <button class="button-15" role="button"> Go to solve mode. </button>
        </Link>
    </div>
}
