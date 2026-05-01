'use client'

import React from 'react'
import { Box, useTheme } from '@mui/material'
import { Sidebar } from "@/components/sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          height: '100vh', 
          overflowY: 'auto',
          p: { xs: 2, md: 4, lg: 6 },
          position: 'relative',
          bgcolor: 'rgba(0,0,0,0.2)' // Subtle depth contrast
        }}
      >
        {/* Decorative background element for SaaS feel */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: 600, 
          height: 600, 
          bgcolor: 'primary.main', 
          opacity: 0.03, 
          filter: 'blur(120px)', 
          borderRadius: 'full', 
          pointerEvents: 'none' 
        }} />
        
        {children}
      </Box>
    </Box>
  )
}
