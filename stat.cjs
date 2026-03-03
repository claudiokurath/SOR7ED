const fs = require('fs');
console.log(fs.statSync('node_modules'));
try {
    console.log(fs.statSync('node_modules/rollup/dist'));
} catch (e) {
    console.log("dist err:", e);
}
