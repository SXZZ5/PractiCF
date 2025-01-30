export default function cfSubmissionCaller(queryParams) {
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
                    throw new Error("user submissions fetch failed");
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