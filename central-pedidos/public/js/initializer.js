$(function () {
    // Handler for .ready() called.
    setAsyncInterval(async () => {
        await update();
    }, 2000);
});