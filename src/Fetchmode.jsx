import { useState } from 'react'
import { MersenneTwister19937, Random, integer } from 'random-js';
import './App.css'
import ProbComponent from './ProbComp';
import TagComponent from './TagComp';
import { AddPset } from './dbops';

let rangeName;
const getRangeName = (lb, ub) => {
    let str = String(lb) + "-" + String(ub);
    rangeName = str;
}

export default function Fetchmode({ modeSetter }) {
    const [chosenproblems, setChosenProblems] = useState([]);
    const [probsLoading, setProbsLoading] = useState(false);
    const [tagList, setTagList] = useState([]);


    const HandleOnClick = () => {
        console.log("Fetch clicked");
        setChosenProblems((prev) => []);
        getStuff(setChosenProblems, tagList, setProbsLoading);
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

function cfProblemsCaller(queryParams) {
    console.log("inside cfProblemsCaller");
    console.log(queryParams);
    var PromiseProblemset = new Promise((resolve) => {
        let url = "https://codeforces.com/api/problemset.problems"
        if (queryParams.length > 0) url += "?tags=";
        queryParams.forEach((z) => {
            url += `${z};`
        })
        const request = new Request(url, {
            cache: "force-cache",
        })
        fetch(request)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("fetch not succesful");
                } else {
                    return response.json();
                }
            }).then((jsobj) => {
                return jsobj;
            }).then((pset) => {
                resolve(pset);
            }).catch((err) => {
                alert(err);
            })
    })
    console.log(PromiseProblemset);
    return PromiseProblemset;
}

function cfSubmissionCaller(queryParams) {
    var PromiseSubmissions = new Promise((resolve) => {
        let url = "https://codeforces.com/api/user.status"
        if (queryParams.length > 0) url += "?";
        console.log(queryParams)
        queryParams.forEach((z) => {
            url += `${z}&`
        });
        const request = new Request(url, {
            cache: "force-cache",
        });

        fetch(request)
            .then((response) => {
                if (!response.ok) {
                    throw new Erro("user submissions fetch failed");
                } else {
                    return response.json();
                }
            })
            .then((subs) => {
                console.log(subs);
                return subs;
            })
            .then((subs) => {
                resolve(subs);
            })
            .catch((err) => {
                alert(err.message);
            });
    })

    return PromiseSubmissions;
}

async function getStuff(setChosenProblems, tagList, setProbsLoading) {
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

    const RandomProbs = chooseRandomProbs(Problemset, Submissions);
    console.log(RandomProbs);
    setProbsLoading((prev) => false)
    setChosenProblems((prev) => {
        console.log("going to set chosenProblems state variable")
        return RandomProbs;
    });
}


function chooseRandomProbs(Problemset, Submissions) {
    console.log("inside chooseRandomProbs")
    // Get user input values.
    let lb = Number(document.getElementById('lb').value);
    let ub = Number(document.getElementById('ub').value);
    let cnt = Number(document.getElementById('cnt').value);
    let roundbound = Number(document.getElementById('roundbound').value);
    getRangeName(lb, ub);

    // Sanity checks on user input values.
    if (lb > ub) {
        alert("bad bounds");
        return;
    }
    else if (lb < 800) {
        alert("bad bounds");
        return;
    } else if (roundbound < 10) {
        alert("bad roundbound, use 10 or greater");
        return;
    }

    // Convert AC Submissions into a hashset having "contestIdIndex" strings.
    let submissionSet = new Set([]);
    Submissions.map((z) => {
        if (z.verdict != "OK") return;
        const str = String(z.problem.contestId) + String(z.problem.index);
        submissionSet.add(str)
    })
    console.log(submissionSet);

    // Filter Problemset array to have only relevant problems.
    const probs = Problemset.filter((z) => {
        if (!("rating" in z)) return false;
        let value = Number(z.rating);
        let contest_id = Number(z.contestId);
        const str = String(z.contestId) + String(z.index);
        let ok = (lb <= ub);
        ok = ok && (roundbound >= 10);
        ok = ok && (value >= lb);
        ok = ok && (value <= ub);
        ok = ok && (contest_id >= roundbound);
        ok = ok && (!submissionSet.has(str));
        return ok;
    }).map((z) => {
        return {
            contestId: z.contestId,
            index: z.index,
            rating: z.rating,
        }
    })

    cnt = Math.min(cnt, probs.length);

    let includedSet = new Set([]);
    const randomProbs = [];
    const engine = MersenneTwister19937.autoSeed();
    const distribution = integer(1, probs.length);
    while (randomProbs.length < cnt) {
        let idx = distribution(engine);
        const probObj = probs[idx - 1];
        const str = String(probObj.contestId) + String(probObj.index);
        if (includedSet.has(str)) {
            continue;
        } else {
            const tmpobject = {
                id: randomProbs.length,
                contestId: probObj.contestId,
                index: probObj.index,
                rating: probObj.rating,
            }
            randomProbs.push(tmpobject);
            includedSet.add(str);
        }
    }

    console.log(randomProbs);

    if (randomProbs.length == 0) {
        randomProbs.push({
            contestId: "fake",
            index: "fake",
            rating: "fake",
        })
    }
    return randomProbs;
}