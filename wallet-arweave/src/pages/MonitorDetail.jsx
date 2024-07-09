import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const MonitorDetail = () => {
    const { id } = useParams();
    const [processEdges, setProcessEdges] = useState([]);
    const [donutChartData, setDonutChartData] = useState({});

    useEffect(() => {
        getProcessDetails();
    }, [id]);

    const getProcessDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/getMessages/${id}`);
            const edges = response.data.data.transactions.edges;
            setProcessEdges(edges);
            console.log(edges);
            const allTags = edges.flatMap(edge => edge.node.tags);
            setDonutChartData(createDonutChartData(allTags));
        } catch (error) {
            console.error("Error fetching process details:", error);
        }
    };

    const createDonutChartData = (tags) => {
        const labels= tags.map(tag => tag.name);
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

    return (
        <>
            <Navbar />
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
                    <p>Loading process details...</p>
                )}
            </div>
        </>
    );
};

export default MonitorDetail;
