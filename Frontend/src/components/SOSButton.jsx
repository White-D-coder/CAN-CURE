import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const SOSButton = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-600/40 animate-bounce flex items-center justify-center group"
            onClick={() => window.location.href = 'tel:112'}
            title="Emergency SOS"
        >
            <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center gap-2 font-bold px-1">
                <Phone className="w-6 h-6" />
                <span>SOS</span>
            </div>
        </motion.button>
    );
};

export default SOSButton;
