const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/getInfo', async (req, res) => {
    console.log(req.body);
    const { processid } = req.body;
    try {
        const response = await axios.post(
            `https://cu73.ao-testnet.xyz/dry-run?process-id=${processid}`,
            {
                Owner: '123456789',
                Target: processid,
                Tags: [
                    {
                        name: 'Action',
                        value: 'Info'
                    }
                ]
            },
            {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    'origin': 'null',
                    'priority': 'u=1, i',
                    'referer': 'https://www.ao.link/',
                    'sec-ch-ua': '"Opera";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error making the request');
    }
});

app.get('/getMessages', async (req, res) => {
    try {
        const response = await axios.post(
            'https://arweave-search.goldsky.com/graphql',
            {
                query: `query ($entityId: String!, $limit: Int!, $sortOrder: SortOrder!, $cursor: String) {
                          transactions(
                            sort: $sortOrder
                            first: $limit
                            after: $cursor
                            recipients: [$entityId]
                          ) {
                            count
                            ...MessageFields
                            __typename
                          }
                        }
                        fragment MessageFields on TransactionConnection {
                          edges {
                            cursor
                            node {
                              id
                              recipient
                              block {
                                timestamp
                                height
                                __typename
                              }
                              ingested_at
                              tags {
                                name
                                value
                                __typename
                              }
                              data {
                                size
                                __typename
                              }
                              owner {
                                address
                                __typename
                              }
                              __typename
                            }
                            __typename
                          }
                          __typename
                        }`,
                variables: {
                    cursor: "",
                    entityId: "3EjFiL4p_hCDAjtu2H9xaOXthsKHL-S_XgOCfOo2Z10",
                    limit: 25,
                    sortOrder: "HEIGHT_DESC"
                }
            },
            {
                headers: {
                    'accept': 'application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    'origin': 'https://www.ao.link',
                    'priority': 'u=1, i',
                    'referer': 'https://www.ao.link/',
                    'sec-ch-ua': '"Opera";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error making the request');
    }
});

app.post('/getResult', async (req, res) => {
    const { messageId, processId } = req.body;
    try {
        const response = await axios.get(
            `https://cu101.ao-testnet.xyz/result/${messageId}?process-id=${processId}`,
            {
                headers: {
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9',
                    'origin': 'null',
                    'priority': 'u=1, i',
                    'referer': 'https://www.ao.link/',
                    'sec-ch-ua': '"Opera";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error making the request');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
