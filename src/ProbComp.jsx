
export default function ProbComponent({ ChosenProbs }) {
    console.log("inside ProbComponent");
    console.log(ChosenProbs);

    if (ChosenProbs.length == 0) {
        return <div className="flex flex-wrap justify-center p-5 items-center">
            Chosen Problems will appear here.
        </div>
    }
    else if (ChosenProbs[0].contestId == "fake") {
        return <>
            <div>No suitable problems found.</div>
            <div>There aren't enough problems and you have solved all that exists.</div>
        </>
    } else {
        return <div className="flex flex-wrap justify-center gap-2  items-center p-5" >
            {ChosenProbs.map((z) => {
                return <OneProblem key={z.id} contestId={z.contestId} index={z.index} />;
            })}
        </div>
    }
}

function OneProblem({ contestId, index }) {
    console.log(contestId + ", " + index);
    const link = "//codeforces.com/contest/" + contestId + "/problem/" + index;
    // return <>
    //     <a href={link} target="_blank"> {contestId} : {index} </a>
    //     <br></br>
    //     <br></br>
    // </>

    return <div>
        <button className="button-10">
            <a href={link} target="_blank">
                {contestId} : {index} </a>
        </button>
        <br></br>
        <br></br>
    </div >

}