import { MersenneTwister19937, Random, integer } from 'random-js';


const getRangeName = (lb, ub) => {
    let str = String(lb) + "-" + String(ub);
    return str;
}

export default function RandomProbFilter(Problemset, Submissions, setRangeName) {
    console.log("inside chooseRandomProbs")
    // Get user input values.
    let lb = Number(document.getElementById('lb').value);
    let ub = Number(document.getElementById('ub').value);
    let cnt = Number(document.getElementById('cnt').value);
    let roundbound = Number(document.getElementById('roundbound').value);
    setRangeName(getRangeName(lb, ub));

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