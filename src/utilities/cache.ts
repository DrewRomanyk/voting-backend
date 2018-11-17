/*
Promise based cache system where it is like

cache(id)
.then((data) => {
    foo.bar(data);
})
.catch((error) => {
    console.log("Error :(", error);
})

The cache, would do these operations
    If in cache
        If not expired, resolve it
    If not in the cache OR expired, obtain it, update cache, resolve it
    If that fails, reject the promise
*/
