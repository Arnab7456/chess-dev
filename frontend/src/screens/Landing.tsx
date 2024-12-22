import { useNavigate } from "react-router-dom";
import { Button } from '../components/Button';
import { motion } from "framer-motion";  
import { buttonVariants, containerVariants, imageVariants } from "../lib/constants/landing.ui";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-[#0a1f0a] to-[#1a3a1a] z-0"
        >
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl space-y-8 md:space-y-0 md:px-0">
               
                <motion.div 
                    className="flex justify-center md:w-1/2 md:px-8" 
                    variants={imageVariants}
                >
                    <img 
                        src="/image.png" 
                        alt="Chess Board" 
                        className="max-w-full md:max-w-lg rounded-lg shadow-lg" 
                    />
                </motion.div>

                
                <motion.div 
                    className="text-center md:text-left md:w-1/2 pt-8 md:pt-16 md:px-8" 
                    variants={containerVariants}
                >
                    <motion.h1 
                        className="text-4xl md:text-5xl font-extrabold text-white"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }}
                    >
                        Play Chess Online
                    </motion.h1>

                    <motion.p 
                        className="mt-4 text-lg text-white opacity-80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
                    >
                        Challenge yourself and play against players from <br /> all around the world!
                    </motion.p>

                    <motion.div 
                        className="mt-8 flex justify-center md:justify-start"
                        variants={buttonVariants}
                    >
                        <Button onClick={() => navigate("/game")}>
                            Play Online
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
