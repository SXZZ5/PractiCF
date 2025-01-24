import { useEffect, useState } from "react";
const tmp = ["combine-tags-by-or", "constructive algorithms", "math", "graphs", "greedy", "hashing", "binary search", "bitmasks", "dp", "brute force", "chinese remainder theorem", "combinatorics", "data structures", "dfs and similar", "divide and conquer", "dsu", "expression parsing", "flows", "games", "geometry", "graph matchings", "implementation", "interactive", "matrices", "meet-in-the-middle", "number theory", "probabilities", "schedules", "shortest paths", "sortings", "string suffix structures", "strings", "ternary search", "trees", "2-sat", "fft", "two-pointers"];

let id = 0;
const alltags = tmp.map((z) => {
    return {
        id: id++,
        name: z,
    }
})


export default function TagComponent({ setTagList }) {
    return <div className="flex flex-wrap justify-center align-center items-center">
        {alltags.map((z) => {
            return <OneTag key={z.id} setTagList={setTagList} thisTag={z.name} />
        })}
    </div>
}

function OneTag({ setTagList, thisTag }) {
    const [toggler, setToggler] = useState(true);
    const handleClick = () => {
        setToggler((prev) => {
            return !prev;
        })
        setTagList((prev) => {
            let copyofprev = prev;
            console.log(copyofprev);
            if (!copyofprev.includes(thisTag)) {
                copyofprev.push(thisTag);
                console.log(copyofprev);
                return copyofprev;
            } else {
                let res = [];
                for (let i = 1; i <= copyofprev.length; ++i) {
                    if (copyofprev[i - 1] == thisTag) continue;
                    else res.push(copyofprev[i - 1]);
                }
                console.log(res);
                return res;
            }
        })
    }

    if (toggler) {
        return <span style={{ margin: "2px" }}>
            <button id={thisTag} className="button-11" role="button" onClick={handleClick}>{thisTag}</button>
        </span>
    } else {
        return <span style= {{ margin: "2px" }}>
            <button id={thisTag} className="button-10" role="button" onClick={handleClick}>{thisTag}</button>
        </span>
    }
}

