import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const MonitorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [processEdges, setProcessEdges] = useState([]);
    const [donutChartData, setDonutChartData] = useState({});
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [loading, setLoading] = useState(true);

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
                if (activeWallet) {
                    setIsWalletConnected(true);
                } else {
                    setIsWalletConnected(false);
                }
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
            const response = await axios.get(`http://localhost:3000/getMessages/${id}`);
            const edges = response.data.data.transactions.edges;
            setProcessEdges(edges);
            const allTags = edges.flatMap(edge => edge.node.tags);
            setDonutChartData(createDonutChartData(allTags));
        } catch (error) {
            console.error("Error fetching process details:", error);
        }
        setLoading(false);
    };

    const createDonutChartData = (tags) => {
        const labels = tags.map(tag => tag.name);
        const data = tags.map(tag => parseInt(tag.value, 10) || 0);
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                },
            ],
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
            </div>
        );
    }

    if (!isWalletConnected) {
        return (
            <>
                {/* <Navbar /> */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-red-500">Please connect your wallet to view this page.</p>
                </div>
            </>
        );
    }

    return (
        <>
            {/* <Navbar /> */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {processEdges.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {processEdges.map((edge, index) => (
                                <div key={index} className="border rounded p-4 mb-4 break-words">
                                    <div>
                                        <p className="truncate"><strong>ID:</strong> {edge.node.id}</p>
                                        <p className="truncate"><strong>Recipient:</strong> {edge.node.recipient}</p>
                                        <p className="text-wrap"><strong>Tags:</strong></p>
                                        <ul>
                                            {edge.node.tags.map((tag, tagIndex) => (
                                                <li key={tagIndex} className="ml-4 truncate">
                                                    <strong>{tag.name}:</strong> {tag.value}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="truncate"><strong>Data Size:</strong> {edge.node.data.size}</p>
                                        <p className="truncate"><strong>Owner:</strong> {edge.node.owner.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Doughnut data={donutChartData} />
                        </div>
                    </>
                ) : (
                    <p>No process details found.</p>
                )}
            </div>
        </>
    );
};

export default MonitorDetail;
