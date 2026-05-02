'use client'

import React from 'react'
import { Box } from '@mui/material'
import { Sidebar } from "@/components/sidebar"
import { CrisisGuard } from "@/components/crisis-guard"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <CrisisGuard riskLevel="LOW" />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          height: '100vh', 
          overflowY: 'auto',
          p: { xs: 2, md: 4, lg: 6 },
          position: 'relative'
        }}
      >
        {/* Decorative background element */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: 600, 
          height: 600, 
          bgcolor: 'primary.main', 
          opacity: 0.05, 
          filter: 'blur(120px)', 
          borderRadius: 'full', 
          pointerEvents: 'none' 
        }} />
        
        {children}
      </Box>
    </Box>
  )
}
