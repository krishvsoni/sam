import  { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const MonitorPage = () => {
    const [processes, setProcesses] = useState([]);

    useEffect(() => {
        getProcesses();
    }, []);

    const getProcesses = async () => {
        if (!window.arweaveWallet) return;
        const activeWallet = await window.arweaveWallet.getActiveAddress();
        try {
            const response = await axios.post('http://localhost:3000/getTransactions', {
                address: activeWallet
            });
            const nodes = response.data.data.transactions.edges.map(edge => edge.node);
            setProcesses(nodes);
            console.log(nodes);
        } catch (error) {
            console.error("Error fetching processes:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-center items-center mb-4">
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
                        />
                    </div>
                </div>
                {processes.length > 0 ? (
                    <ul>
                        {processes.map((process) => (
                            <li key={process.id} className="mb-4">
                                <div className="border rounded p-4">
                                    <p><strong>ID:</strong> {process.id}</p>
                                    <p><strong>Tags:</strong></p>
                                    <ul>
                                        {process.tags.map((tag, index) => (
                                            <li key={index} className="ml-4">
                                                <strong>{tag.name}:</strong> {tag.value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No processes found.</p>
                )}
            </div>
        </>
    );
};

export default MonitorPage;
