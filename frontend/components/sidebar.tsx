'use client'

import React from 'react'
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Avatar, Divider, 
  IconButton, Tooltip, useTheme, Badge
} from '@mui/material'
import { 
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Book as JournalIcon,
  Insights as InsightsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Psychology as BrainIcon,
  Notifications as BellIcon,
  VideoCameraFront as MultimodalIcon
} from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'AI Therapist', icon: <ChatIcon />, path: '/chat' },
  { label: 'Journal', icon: <JournalIcon />, path: '/journal' },
  { label: 'Insights', icon: <InsightsIcon />, path: '/insights' },
  { label: 'Multimodal', icon: <MultimodalIcon />, path: '/multimodal' },
]

export function Sidebar() {
  const theme = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  return (
    <Box sx={{ 
      width: 280, 
      height: '100vh', 
      bgcolor: 'background.paper', 
      borderRight: '1px solid',
      borderColor: 'rgba(255,255,255,0.05)',
      display: 'flex', 
      flexDirection: 'column',
      zIndex: 100
    }}>
      {/* Brand */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, boxShadow: '0 0 20px rgba(208, 188, 255, 0.3)' }}>
          <BrainIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }}>
            Mindful<Box component="span" sx={{ color: 'primary.main' }}>AI</Box>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.6rem' }}>
            SaaS Platform
          </Typography>
        </Box>
      </Box>

      {/* Main Nav */}
      <Box sx={{ flex: 1, px: 2, mt: 2 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.path}
                  sx={{ 
                    borderRadius: 4,
                    py: 1.5,
                    bgcolor: isActive ? 'rgba(208, 188, 255, 0.08)' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(208, 188, 255, 0.2)' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.03)',
                      color: 'primary.main'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: isActive ? 900 : 600,
                      letterSpacing: 0.2
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Bottom Profile */}
      <Box sx={{ p: 2, mb: 2 }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 6, 
          bgcolor: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Badge color="success" variant="dot" overlap="circular">
            <Avatar src={user?.avatar} sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.1)' }}>
              {user?.username?.[0]}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.username || 'Guest'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'capitalize' }}>
              {user?.role || 'Free Tier'}
            </Typography>
          </Box>
          <Tooltip title="Account Settings">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <ListItemButton 
          onClick={logout}
          sx={{ 
            mt: 2, 
            borderRadius: 4, 
            color: 'error.main',
            '&:hover': { bgcolor: 'rgba(239, 83, 80, 0.05)' }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  )
}
