function run(callback, param) {
    return callback(param)
}

function noCall(num) {
    return ++num;
}
const inc = (num) => {
    return ++num;
}

console.log(run(inc, 1));
console.log(run(noCall, 2));