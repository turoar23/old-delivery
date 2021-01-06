const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex].run) {
        asyncIntervals[intervalIndex].id = setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval)
    }
};

const setAsyncInterval = (cb, interval) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push({ run: true, id: 0 })
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('Callback must be a function');
    }
};

const clearAsyncInterval = (intervalIndex) => {
    if (asyncIntervals[intervalIndex].run) {
        clearTimeout(asyncIntervals[intervalIndex].id)
        asyncIntervals[intervalIndex].run = false
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function equals(arr1, arr2){
    var equals = true;

    if(arr1.length == arr2.length){
        for(var i = 0; i < arr1.length && equals; i++){
            equals = (arr1[i].id == arr2[i].id) &&
                    (arr1[i].app == arr2[i].app) &&
                    (arr1[i].status == arr2[i].status);
        }
    }
    else
        equals = false;

    return equals;

}