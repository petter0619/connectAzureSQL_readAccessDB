const fetch = require('node-fetch');

const endpoint = "https://todoapi0619.azure-api.net/todoapp0619/Todos";
const functionAppMasterKey = 'KM3hEtbAgxUobFjXpBuou0SJm1l4x4AMT5qm8UuncGobrob48iHq1g==';
const apiManagementSubscriptionKey = '5193e2a4e4a743c0b702cdb850a91a44';

const fetchTrigger = async (endpoint) => {
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            //'x-functions-key': functionAppMasterKey,
            'Ocp-Apim-Subscription-Key': apiManagementSubscriptionKey
        }
    });
    const data = await response.json();
    console.log(data);
}

fetchTrigger(endpoint);
