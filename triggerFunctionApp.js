const fetch = require('node-fetch');

const endpoint = "<functionAppURI>";
const functionAppMasterKey = '<key>';
const apiManagementSubscriptionKey = '<key>';

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
