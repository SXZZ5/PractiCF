import { useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import { useEffect } from "react";
import { getNotes, saveNotes } from "./dbops";
import './App.css'

let editor;

export default function ProblemPage() {
    let params = useParams();
    console.log("inside ProblemEditor component");
    console.log(params);
    const tmp = `https://codeforces.com/problemset/problem/${params.probId}`
    console.log(tmp);
    let url = String('');
    for (let i = 1; i <= tmp.length; ++i) {
        if (tmp[i - 1] == '-') url += '/';
        else url += tmp[i - 1];
    }
    console.log(url);

    useEffect(() => {
        console.log("useEffect working");
        initialiseEditor(params.probId);
    }, [params]);

    return (
        <div id="Texteditor">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "15px"
            }}>
                <a href={url} target="_blank">
                <div className="text-4xl">{params.probId}</div> 
                </a>
                <button className="button-15" role="button" onClick={() => {
                    sendData(params.probId);
                }}> Save notes  </button>
            </div>
            <div id="wrapEditingArea" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexBasis: "8000px",
            }}>
                <div key={Math.random()} id="editingArea" style={{
                    display: "flex",
                    flexBasis: "8000px",
                    flexGrow: "2",
                    justifyContent: "flex-start",
                }}>
                </div>
            </div>

        </div>
    )
}

async function initialiseEditor(cid) {
    let notes = {};
    const res = await getNotes(cid)
    if (res.status != "0") notes = res.data;

    console.log(notes);

    editor = new EditorJS({
        holder: "editingArea",
        autofocus: true,
        placeholder: `Add your notes here ${cid}`,
        data: notes.data,
        hideToolbar: true,
    })
}

async function sendData(cid) {
    let data = await editor.save();
    let response = await saveNotes(cid, data);
    console.log(response);
}



