import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MonitorPage = () => {
    const [processes, setProcesses] = useState([]);
    const [expandedProcessId, setExpandedProcessId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getProcesses();
        setupWebSocket();
    }, []);

    const getProcesses = async () => {
        if (!window.arweaveWallet) return;
        const activeWallet = await window.arweaveWallet.getActiveAddress();
        try {
            const response = await axios.post('http://localhost:3000/getProcesses', {
                address: activeWallet
            });
            const nodes = response.data.data.transactions.edges.map(edge => edge.node);
            setProcesses(nodes);
        } catch (error) {
            console.error("Error fetching processes:", error);
        }
    };

    const setupWebSocket = () => {
        const socket = new WebSocket("ws://localhost:3000");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "process_update") {
                getProcesses();
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    };

    const handleExpand = (processId) => {
        if (expandedProcessId === processId) {
            setExpandedProcessId(null);
        } else {
            setExpandedProcessId(processId);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success('Copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const filteredProcesses = processes.filter((process) => {
        const processString = JSON.stringify(process).toLowerCase();
        return processString.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ToastContainer />
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-center">Your Processes</h2>
                <div className="relative mt-5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a7 7 0 017 7c0 .84-.15 1.64-.42 2.38l3.86 3.86a1 1 0 11-1.42 1.42l-3.86-3.86A7 7 0 119 2zm0 2a5 5 0 100 10A5 5 0 009 4z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search Process"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {filteredProcesses.length > 0 ? (
                <ul>
                    {filteredProcesses.map((process) => (
                        <li key={process.id} className="mb-4">
                            <div className="border rounded p-4 hover:bg-gray-800 transition duration-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p><strong>ID:</strong> {process.id}</p>
                                        {expandedProcessId === process.id && (
                                            <>
                                                <p><strong>Tags:</strong></p>
                                                <ul>
                                                    {process.tags.map((tag, index) => (
                                                        <li key={index} className="ml-4">
                                                            <strong>{tag.name}:</strong> {tag.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="flex gap-5"> 
                                                    <button
                                                        onClick={() => navigate(`/monitor/${process.id}`)}
                                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                                                    >
                                                        View Messages
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/analyze/${process.id}`)}
                                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                                                    >
                                                        Analyzer
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleExpand(process.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center transition duration-200"
                                        >
                                            {expandedProcessId === process.id ? (
                                                <svg
                                                    className="h-5 w-5 transition-transform duration-200"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5 9l5 5 5-5H5z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="h-5 w-5 transition-transform duration-200"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5 11l5-5 5 5H5z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(process.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-200"
                                        >
                                            Copy ID
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No processes found.</p>
            )}
        </div>
    );
};

export default MonitorPage;
