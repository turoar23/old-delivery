// Make sure this code gets executed after the DOM is loaded.
document.querySelector("#id").addEventListener("keyup", event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    document.querySelector("#add-order").click(); // Things you want to do.
    event.preventDefault(); // No need to `return false;`.
});