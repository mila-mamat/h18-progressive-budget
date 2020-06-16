let db;
// create a new db request for the budget indexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  // Set auto increment to true for the pending store
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const store = transaction.objectStore("pending");
  // get all records from store and set to a variable
  const getAll = store.getAll();
  // if there a values in the indexedDB post them to the actual database
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["pending"], "readwrite");

          // access your pending object store
          const store = transaction.objectStore("pending");

          // clear all items in the store once they have been posted to the database
          store.clear();
        })
        .catch((err) => console.log(err));
    }
  };
}

// save newly added transaction to pending if app is offline
export function saveTransaction(newTransaction) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // access your pending object store
  const store = transaction.objectStore("pending");

  // add record to your store with add method.
  store.add(newTransaction);
}

//add the pending transactions to the transaction array to display if app is offline
export function getTransactions(transactions, callback) {
  let storedTransaction;
  //check if the indexeddb database exists
  if (db) {
    // create a transaction on the pending db with read access
    const transaction = db.transaction(["pending"], "readonly");

    // access your pending object store
    const store = transaction.objectStore("pending");

    // add record to your store with add method.
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      storedTransaction = getAll.result;

      if (storedTransaction != []) {
        storedTransaction.forEach((transaction) => {
          transactions.unshift(transaction);
        });

        callback();
      }
    };
  }
  return storedTransaction;
}
