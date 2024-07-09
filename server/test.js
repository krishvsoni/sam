const { createDataItemSigner, spawn } = require('@permaweb/aoconnect');
const fs = require('fs');
// const { createDataItemSigner, spawn } = require('@permaweb/aoconnect');
const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));

async function getProcessId() {
    const processId = await spawn({
        module:"nI_jcZgPd0rcsnjaHtaaJPpMCW847ou-3RGA5_W3aZg",
        scheduler:"_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
        signer: createDataItemSigner(wallet),
        tags:[{name:"type",value:"process"}],
        data:'require("json").encode(inbox)',
    });
    return processId;
}
async function displayID(){

    const processId = await getProcessId();
    console.log(processId);
}
displayID()