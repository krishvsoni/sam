import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MonitorDetail = () => {
  const { id } = useParams();
  const [processEdges, setProcessEdges] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState("");

  const backgroundImages = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg"
  ];

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (isWalletConnected) {
      getProcessDetails();
    }
  }, [id, isWalletConnected]);

  const checkWalletConnection = async () => {
    if (window.arweaveWallet) {
      try {
        const activeWallet = await window.arweaveWallet.getActiveAddress();
        setIsWalletConnected(!!activeWallet);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsWalletConnected(false);
      }
    } else {
      setIsWalletConnected(false);
    }
    setLoading(false);
  };

  const getProcessDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sam_backend.haardsolanki-itm.workers.dev/api/process/getMessages/${id}`);
      const data = response.data.data.data.transactions;
      const edges = data.edges;
      setProcessEdges(edges);
      const tags = edges.flatMap((edge) => edge.node.tags);
      setAllTags(groupTags(tags));
    } catch (error) {
      console.error("Error fetching process details:", error);
    }
    setLoading(false);
  };

  const groupTags = (tags) => {
    const tagMap = new Map();
    tags.forEach((tag) => {
      const tagName = tag.name;
      if (tagMap.has(tagName)) {
        tagMap.set(tagName, tagMap.get(tagName) + 1);
      } else {
        tagMap.set(tagName, 1);
      }
    });

    return Array.from(tagMap.entries()).map(([name, value]) => ({ name, value }));
  };

  const filteredProcessEdges = processEdges.filter((edge) =>
    edge.node.tags.some(
      (tag) =>
        tag.value.toLowerCase().includes(tagFilter.toLowerCase()) ||
        tag.name.toLowerCase().includes(tagFilter.toLowerCase())
    )
  );

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagFilter.toLowerCase()) ||
    tag.value.toString().toLowerCase().includes(tagFilter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-4"></div>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-red-500">Please connect your wallet to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-mono">
      <h1 className="text-3xl font-bold mb-6">Process Block Messages</h1>
      <div className="mb-6">
        <input
          type="text"
          id="tagFilter"
          name="tagFilter"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter tag value to filter"
        />
      </div>
      {filteredProcessEdges.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProcessEdges.map((edge, index) => (
            <div
              key={index}
              className="relative rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center blur"
                style={{
                  backgroundImage: `url(${backgroundImages[index % backgroundImages.length]})`
                }}
              ></div>
              <div className="absolute inset-0 bg-black opacity-30"></div>
              <div className="relative p-6 text-white">
                <p className="truncate"><strong>ID:</strong> {edge.node.id}</p>
                <p className="truncate"><strong>Recipient:</strong> {edge.node.recipient}</p>
                <p className="truncate"><strong>Block Height:</strong> {edge.node.block.height}</p>
                <p className="truncate"><strong>Timestamp:</strong> {new Date(edge.node.block.timestamp * 1000).toLocaleString()}</p>
                <p className="truncate"><strong>Ingested At:</strong> {new Date(edge.node.ingested_at * 1000).toLocaleString()}</p>
                <p className="truncate"><strong>Owner Address:</strong> {edge.node.owner.address}</p>
                <p className="text-wrap"><strong>Tags:</strong></p>
                <ul>
                  {edge.node.tags.map((tag, tagIndex) => (
                    <li key={tagIndex} className="ml-4">
                      <strong>{tag.name}:</strong> {tag.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
       !loading && <p className="text-center text-gray-500">No processes found matching the filter criteria.</p>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Tag Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {filteredTags.map((tag, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <p className="font-bold">{tag.name}</p>
              <p>{tag.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitorDetail;