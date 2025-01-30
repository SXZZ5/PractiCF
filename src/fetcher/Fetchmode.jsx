import { useState } from 'react'

import '../app/App.css'
import ProbComponent from './ProbComp';
import TagComponent from './TagComp';
import { AddPset } from '../idb/dbops';
import cfProblemsCaller from '../apicalls_utils/cfprobcaller';
import cfSubmissionCaller from '../apicalls_utils/cfsubcaller';
import Virtual from '../virtual/virtual';
import RandomProbFilter from '../apicalls_utils/randomprobfilter';

export default function Fetchmode() {
    const [chosenproblems, setChosenProblems] = useState([]);
    const [probsLoading, setProbsLoading] = useState(false);
    const [tagList, setTagList] = useState([]);
    const [rangeName, setRangeName] = useState("");


    const HandleOnClick = () => {
        console.log("Fetch clicked");
        setChosenProblems((prev) => []);
        getStuff(setChosenProblems, tagList, setProbsLoading, setRangeName);
    }

    return <>
        <div className="sk_Fetchmode">
            <div className='flex flex-col justify-start gap-3'>
                <div>
                    <label htmlFor="lb" className="sk_box"> Lower Bound: </label>
                    <input className="sk_textbox" type="text" id="lb" placeholder="Lower limit of difficulty" />
                </div>
                <div>
                    <label htmlFor="ub" className="sk_box"> Upper Bound: </label>
                    <input className="sk_textbox" type="text" id="ub" placeholder="Upper limit of difficulty" />
                </div>
                <div>
                    <label htmlFor="roundbound" className="sk_box">Round Bound: </label>
                    <input className="sk_textbox" type="text" id="roundbound" placeholder="Oldest allowed round" />
                </div>
                <div>
                    <label htmlFor="cnt" className="sk_box">Count:</label>
                    <input className="sk_textbox" type="text" id="cnt" placeholder="Enter count" />
                </div>
                <div>
                    <label htmlFor="userHandle" className="sk_box">Handle:</label>
                    <input className="sk_textbox" type="text" id="userHandle" placeholder='CF handle ?' />
                </div>
                <div>
                    <label htmlFor="solveCount" className="sk_box">Solved Count:</label>
                    <input className="sk_textbox" type="text" id="solveCount" placeholder='Probs solved till now ?' />
                </div>
            </div>

            <br></br>
            <TagComponent tagList={tagList} setTagList={setTagList} />
            <br></br>
        </div>

        <div className="flex justify-evenly">
            <button onClick={HandleOnClick} className="button-15"> Fetch or Shuffle </button>
            <button className="button-15" onClick={() => {
                AddPset(rangeName, chosenproblems)
            }}> Add this Pset </button>
        </div>
        <ProbComponent ChosenProbs={chosenproblems} probsLoading={probsLoading} />

    </>
}

async function getStuff(setChosenProblems, tagList, setProbsLoading, setRangeName) {
    setProbsLoading((prev) => true);
    let data = await cfProblemsCaller(tagList);
    const Problemset = data.result.problems;
    console.log(Problemset);

    // Preparing parameters for the query string to user.status api call.
    const userHandle = document.getElementById("userHandle").value;
    const subCount = Number(document.getElementById("solveCount").value) * 20;
    let subData = await cfSubmissionCaller([`handle=${userHandle}`, "from=1", `count=${subCount}`]);
    const Submissions = subData.result;
    console.log(Submissions);

    const RandomProbs = RandomProbFilter(Problemset, Submissions, setRangeName);
    console.log(RandomProbs);
    setProbsLoading((prev) => false)
    setChosenProblems((prev) => {
        console.log("going to set chosenProblems state variable")
        return RandomProbs;
    });
}

