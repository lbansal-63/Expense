import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCpu, FiX, FiZap, FiLoader } from 'react-icons/fi';
import { getAIAdvice } from '../utils/renders';
import toast from 'react-hot-toast';

const AIAdvisor = ({ expenses, budgetStats, userName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGetAdvice = async () => {
        if (expenses.length === 0) {
            toast.error('Add some expenses first to get advice!');
            return;
        }
        setLoading(true);
        const result = await getAIAdvice(expenses, budgetStats, userName);
        if (result) {
            setAdvice(result);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:hidden"></div>
                <FiCpu className="relative z-10" />
            </button>

            {/* AI Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                    <FiZap />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Financial Advisor</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(80vh-160px)] custom-scrollbar">
                            {!advice && !loading ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                                        <FiCpu size={40} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Need some financial guidance?</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                        Our AI will analyze your spending patterns and provide personalized tips to help you save more.
                                    </p>
                                    <button 
                                        onClick={handleGetAdvice}
                                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                                    >
                                        Generate Advice
                                    </button>
                                </div>
                            ) : loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                                            <FiLoader size={24} />
                                        </div>
                                    </div>
                                    <p className="mt-6 text-slate-900 dark:text-white font-black animate-pulse">Analyzing your finances...</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Gemini is thinking</p>
                                </div>
                            ) : (
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">
                                        <ReactMarkdown 
                                            components={{
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-black mb-4 text-indigo-600" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-6" {...props} />,
                                                h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                                                li: ({node, ...props}) => <li className="mb-2 list-disc ml-4" {...props} />,
                                                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                                            }}
                                        >
                                            {advice}
                                        </ReactMarkdown>
                                    </div>
                                    <button 
                                        onClick={handleGetAdvice}
                                        className="mt-8 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:underline"
                                    >
                                        <FiZap /> Regenerate Advice
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] text-center">
                                AI responses can be inaccurate. Always consult with a human professional for critical decisions.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAdvisor;
