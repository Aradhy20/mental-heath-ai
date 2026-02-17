'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AnimatedAccordionProps {
  items: AccordionItem[]
  className?: string
  allowMultipleOpen?: boolean
}

const AnimatedAccordion: React.FC<AnimatedAccordionProps> = ({ 
  items, 
  className = '',
  allowMultipleOpen = false
}: AnimatedAccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultipleOpen) {
      if (openItems.includes(id)) {
        setOpenItems(openItems.filter((itemId: string) => itemId !== id));
      } else {
        setOpenItems([...openItems, id]);
      }
    } else {
      setOpenItems(openItems.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={className}>
      {items.map((item: AccordionItem) => (
        <div key={item.id} className="border-b border-gray-200">
          <button
            onClick={() => toggleItem(item.id)}
            className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-700 hover:text-gray-900"
          >
            <span>{item.title}</span>
            <motion.svg
              className="h-5 w-5 text-gray-500"
              animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          
          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-4 text-gray-600">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default AnimatedAccordion;