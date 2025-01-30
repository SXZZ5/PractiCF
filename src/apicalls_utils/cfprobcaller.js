export default function cfProblemsCaller(queryParams) {
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