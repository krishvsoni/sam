import { motion } from "framer-motion";
import { LampContainer } from "./ui/lamp";
import { useNavigate } from "react-router-dom";

export function LampDemo() {
    const navigate = useNavigate();

    const handleClick = (route) => {
        navigate(route);
    };

    return (
        <LampContainer>
            <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
            >
                You Write We Monitor
                <div className="grid grid-cols-2 gap-4 mt-10 tracking-wide">
                    <button onClick={() => handleClick('/offchain')} className="btn btn-outline text-xl">Off-Chain</button>
                    <button onClick={() => handleClick('/monitor')} className="btn btn-outline text-xl">On-Chain</button>
                </div>
            </motion.h1>
        </LampContainer>
    );
}
