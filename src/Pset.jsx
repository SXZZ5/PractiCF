import { Link, Outlet, useOutlet, useParams } from "react-router-dom"
import { onePset } from "./dbops";
import { useEffect, useState } from "react";
import './Solve.css'
import './App.css'
import { Sidebar, SidebarItem } from "flowbite-react";

export default function Pset() {
    let params = useParams();
    const [arr, setArr] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        onePset(params.rangeName).then((z) => {
            setArr((prev) => z);
            setisLoading((prev) => false);
        })
    }, [])

    if (isLoading) {
        return <>
            Brb loading.
        </>
    } else {
        return <>
            <ProblemSidebar probArr={arr} />
        </>
    }
}

function ProblemSidebar({ probArr }) {
    let idvar = 0;

    const childElement = useOutlet();
    return <div style={{
        display: "flex",
        gap: "70px",
    }} id="TopDiv Parent">
        <Sidebar style={{
            display: "flex",
            borderTop: "inset",
            borderLeft: "inset",
            borderRight: "inset",
            height: "200vh",

        }}>
            <Sidebar.Items>
            <Sidebar.ItemGroup >
            {probArr.map((z) => {
                ++idvar;
                return <div key={idvar}>
                    <Sidebar.Item>
                        <Link to={`./${z.contestId}-${z.index}`}>
                            {`${z.contestId}${z.index}`}
                        </Link>
                    </Sidebar.Item>
                </div>
            })}
            </Sidebar.ItemGroup>
            </Sidebar.Items>
            <Sidebar.ItemGroup>
                <SidebarItem>
                    <Link to="/">Home</Link>
                </SidebarItem>
                <SidebarItem>
                    <Link to="/solve">Psets</Link>
                </SidebarItem>
            </Sidebar.ItemGroup>
            </Sidebar>
        <div style={{
            flexBasis: "8000px",
            justifyContent: "flex-start",
        }} id="EditorContainer">
            {childElement}
        </div>
    </div>
}

