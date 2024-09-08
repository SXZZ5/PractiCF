
export function makedb() {
    var promise = new Promise((resolve, reject) => {
        const dbOpenRequest = window.indexedDB.open("SKDB", 1);
        dbOpenRequest.onerror = (event) => {
            console.log("could not open idb");
            console.error(event);
            reject(event);
        }

        dbOpenRequest.onsuccess = (event) => {
            const db = dbOpenRequest.result;
            console.log("opening db successful")
            resolve(db);
        }

        dbOpenRequest.onupgradeneeded = (event) => {
            const db = dbOpenRequest.result;
            db.createObjectStore("PSETS", { keyPath: "rangeName" })
            db.createObjectStore("PROBS", { keyPath: "cid" })
            resolve(db);
        }
    })
    return promise;
}

export async function AddPset(rangeName, chosenproblems) {
    const db = await makedb();
    console.log(db.name);
    const dbtxn = db.transaction(["PSETS"], "readwrite")
    const store = dbtxn.objectStore("PSETS");

    const ReplaceCheck = store.count(rangeName);
    ReplaceCheck.onerror = (event) => {
        console.log("could not get rangeName count");
        console.error(ReplaceCheck.error);
    }

    ReplaceCheck.onsuccess = (event) => {
        let cnt = ReplaceCheck.result;
        if (cnt != 0) {
            store.put({
                rangeName: rangeName,
                probs: chosenproblems,
            })
        } else {
            newAdder();
        }
    }

    const newAdder = () => {
        const CountRequest = store.count();
        let foundCount;
        CountRequest.onerror = (event) => {
            console.log("could not get count");
            console.error(CountRequest.error);
        }

        CountRequest.onsuccess = (event) => {
            console.log("countrequest succesful");
            foundCount = CountRequest.result;
            console.log(foundCount);
            if (foundCount >= 5) {
                alert("Stop adding, go solve something");
            } else {
                const addRequestObj = store.put({
                    rangeName: rangeName,
                    probs: chosenproblems,
                })

                addRequestObj.onerror = (event) => {
                    console.log("adding pset failed");
                    console.error(addRequestObj.error);
                }

                addRequestObj.onsuccess = (event) => {
                    console.log("adding pset succeeded");
                }
            }
        }
    }
}

export async function activePsets() {
    const db = await makedb();
    var PsetsInIDB = new Promise((resolve, reject) => {
        console.log(typeof db);
        console.log(db);
        const dbtxn = db.transaction(["PSETS"], "readonly");
        const store = dbtxn.objectStore("PSETS");
        const getallRequest = store.getAll();
        getallRequest.onerror = (event) => {
            console.log("could not do the getALL on PSET store");
            console.error(getallRequest.error);
            reject(getallRequest.error);
        }

        getallRequest.onsuccess = (event) => {
            console.log("getall request from PSET succesful");
            console.log(getallRequest.result);
            resolve(getallRequest.result);
        }
    })
    return PsetsInIDB;
}

export async function onePset(rangeName) {
    const db = await makedb();
    console.log("inside onePset");
    var promise = new Promise((resolve, reject) => {
        const dbtxn = db.transaction(["PSETS"], "readonly");
        const store = dbtxn.objectStore("PSETS");

        const getRequest = store.get(rangeName);
        getRequest.onerror = (event) => {
            console.log("oops, couldn't get this pset's info");
            console.log(getRequest.error);
            reject(getRequest.error);
        }

        getRequest.onsuccess = (event) => {
            console.log("success to indidvidual get");
            console.log(getRequest.result.probs);
            resolve(getRequest.result.probs);
        }
    })

    return promise;
}

export async function saveNotes(cid, data) {
    console.log("inside saveNotes dbop");
    console.log(cid, data);
    const db = await makedb();
    var promise = new Promise((resolve, reject) => {
        const obj = {
            cid: cid,
            data: data,
        }
        const dbtxn = db.transaction(["PROBS"], "readwrite");
        const store = dbtxn.objectStore("PROBS");
        const putRequest = store.put(obj)

        putRequest.onerror = (event) => {

            console.log("could not save data ");
            console.log(putRequest.error);
        }

        putRequest.onsuccess = (event) => {
            console.log("save succesful");
            resolve("success")
        }
    })

    return promise;
}

export async function getNotes(cid){
    const db = await makedb();
    var promise = new Promise((resolve, reject) => {
        const dbtxn = db.transaction(["PROBS"], "readonly")
        const store = dbtxn.objectStore("PROBS");
        const countRequest = store.count(cid);
        countRequest.onerror = (event) => {
            console.log("could not get the count while attempting to fetch probdata");
            console.error(countRequest.error);
            reject(countRequest.error);
        }

        countRequest.onsuccess = (event) => {
            const cnt = countRequest.result;
            if(cnt == 0){
                resolve({
                    status: "0",
                })
            } else {
                const getRequest = store.get(cid);
                getRequest.onerror = (event) => {
                    console.log("could not get the data for the problem");
                }

                getRequest.onsuccess = (event) => {
                    resolve({
                        status: "1", 
                        data: getRequest.result,
                    })
                }
            }
        }
    })

    return promise;
}