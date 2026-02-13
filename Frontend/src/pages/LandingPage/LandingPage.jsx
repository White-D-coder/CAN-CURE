import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Users, ArrowRight, Heart } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans']">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-50 p-2 rounded-lg">
                            <Activity className="w-6 h-6 text-primary-600" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            CAN-CURE
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white" />

                <div className="container mx-auto px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-8 border border-primary-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Revolutionizing Cancer Care Management
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
                            Advanced Care for <br />
                            <span className="bg-gradient-to-r from-primary-600 to-sky-400 bg-clip-text text-transparent">
                                Better Tomorrows
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Empowering patients and doctors with AI-driven insights, secure records, and seamless communication. Your journey to recovery starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center gap-2 group"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                            >
                                Doctor Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Activity className="w-8 h-8 text-primary-500" />}
                            title="AI-Driven Insights"
                            description="Leverage advanced artificial intelligence for early detection and personalized treatment recommendations."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-primary-500" />}
                            title="Secure Records"
                            description="Your medical history is encrypted and stored securely, accessible only to authorized healthcare providers."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-primary-500" />}
                            title="Seamless Connection"
                            description="Direct communication channels between patients and specialists for real-time care management."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 py-12 mt-auto border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            <span className="text-lg font-bold text-gray-700">CAN-CURE</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} CAN-CURE. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all hover:-translate-y-1"
    >
        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;
