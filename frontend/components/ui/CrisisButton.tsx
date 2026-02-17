'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Phone, MessageSquare, X, HeartHandshake } from 'lucide-react'

const CrisisButton = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 p-4 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95 transition-all group"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ rotate: 90 }}
            >
                <ShieldAlert size={28} className="group-hover:animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border-l-4 border-red-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="text-center mb-8 pt-4">
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <HeartHandshake size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">You Are Not Alone</h2>
                                    <p className="text-muted-foreground">help is available right now. Please reach out.</p>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href="tel:988"
                                        className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group"
                                    >
                                        <div className="p-3 bg-red-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Call 988</p>
                                            <p className="text-sm text-muted-foreground">Suicide & Crisis Lifeline</p>
                                        </div>
                                    </a>

                                    <a
                                        href="sms:741741"
                                        className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors group"
                                    >
                                        <div className="p-3 bg-blue-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                                            <MessageSquare size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Text HOME to 741741</p>
                                            <p className="text-sm text-muted-foreground">Crisis Text Line</p>
                                        </div>
                                    </a>
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground text-sm hover:underline"
                                    >
                                        I'm okay, just looking
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default CrisisButton
