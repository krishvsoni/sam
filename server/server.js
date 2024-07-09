import express from 'express';
// const axios = require('axios');
import axios from 'axios';
// const cors = require('cors');
import cors from 'cors';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { spawn } from '@permaweb/aoconnect';
const app = express();
const port = 3000;
// const gql = require('graphql-tag');
// const { print } = require('graphql');
app.use(express.json());
app.use(cors());
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

app.get('/getMessages/:entity', async (req, res) => {
  const entity = req.params.entity;
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
          entityId: entity,
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
app.get('/getOwner/:msgid', async (req, res) => {
  const msgid = req.params.msgid;
  
  try {
    const response = await axios.post(
      'https://arweave-search.goldsky.com/graphql',
      {
        query: `query ($id: ID!) {
          transactions(ids: [$id]) {
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
        }
        `,
        variables: {
          id: msgid
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
    const ownerAddress = response.data.data.transactions.edges[0]?.node?.owner?.address;
    // const owner=response.data.transactions.edges[0].owner.address;
    res.json(ownerAddress);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error making the request');
  }
});


app.post('/getResults', async (req, res) => {
  const { processId, messageIds } = req.body;
  let results = [];

  for (let i = 0; i < messageIds.length; i++) {
    try {
      const response = await axios.get(
        `https://cu72.ao-testnet.xyz/result/${messageIds[i]}?process-id=${processId}`,
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

      let dataValue;
      try {
        const outputData = response.data.Output.data;
        dataValue = outputData.match(/Data = (.*)/)[1];
      } catch (parseError) {
        dataValue = response.data;
      }

      results.push({ messageId: messageIds[i], dataValue });

      // Wait for a specified interval before sending the next request
      if (i < messageIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2000 ms interval
      }
    } catch (error) {
      console.error(`Error making the request for messageId ${messageIds[i]}:`, error);
      results.push({ messageId: messageIds[i], error: 'Error making the request' });
    }
  }

  res.json({ results });
});
app.post('/getMessageDataWithOwner/bulk', async (req, res) => {
  const { messageIds, processId } = req.body;
  

  try {
    const results = [];

    for (let i = 0; i < messageIds.length; i++) {
      const messageId = messageIds[i];
      // const url = urls[i % urls.length]; // Cycle through the URLs

      // console.log("Getting message data for messageId:", messageId, "using URL:", url);

      // Fetch message data from local endpoint
      const messageResponse = await axios.post('http://localhost:3000/getResult', { messageId, processId });

      const outputData = messageResponse.data;

      // Fetch owner information from Arweave
      const ownerResponse = await axios.post(
        'https://arweave-search.goldsky.com/graphql',
        {
          query: `query ($id: ID!) {
            transactions(ids: [$id]) {
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
          }
          `,
          variables: {
            id: messageId
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

      const transactionNode = ownerResponse.data.data.transactions.edges[0]?.node;
      const ownerAddress = transactionNode?.owner?.address;
      const tags = transactionNode?.tags.map(tag => ({ name: tag.name, value: tag.value }));

      results.push({ messageData: outputData, owner: ownerAddress, tags: tags });
    }

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error making the request');
  }
});

app.post('/getTransactions', async (req, res) => {
  const { address } = req.body;

  // Construct the GraphQL query
  const query = gql`
      query {
        transactions(
          owners: "${address}", 
          tags: [{ name: "Data-Protocol", values: ["ao"] }, { name: "Type", values: ["Process"] }],
          first: 999
        ) {
          edges {
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }
    `;

  try {
    const response = await axios.post(
      'https://arweave-search.goldsky.com/graphql',
      {
        query: print(query),
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
app.get('/spawnCron', async (req, res) => {
  const spawnId = await spawn({

    module: "nI_jcZgPd0rcsnjaHtaaJPpMCW847ou-3RGA5_W3aZg",
    scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
    signer: createDataItemSigner(wallet),
    tags: [{ name: "Cron-Interval", value: "30-seconds" }, {
      value: "Cron",
      name: "Cron-Tag-Action"
    }],


  })
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
