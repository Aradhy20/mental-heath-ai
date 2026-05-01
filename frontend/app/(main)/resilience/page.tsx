"use client"

import React from 'react'
import { 
  Box, Container, Typography, Grid2 as Grid, 
  Card, CardContent, Stack, Button, IconButton
} from '@mui/material'
import { 
  Psychology as CBTIcon,
  Air as BreatheIcon,
  SelfImprovement as ZenIcon,
  HelpOutline as AssessmentIcon,
  ArrowForward as ArrowIcon,
  Shield as SafetyIcon
} from '@mui/icons-material'
import { PremiumHeader } from '@/components/layout/premium-header'

export default function ResiliencePage() {
  const tools = [
    { title: "Thought Reframer", desc: "Identify and challenge cognitive distortions.", icon: <CBTIcon />, color: "#8b5cf6" },
    { title: "5-4-3-2-1 Grounding", desc: "Reconnect with your senses during panic.", icon: <ZenIcon />, color: "#3b82f6" },
    { title: "Serenity Breather", desc: "Interactive guided breathing cycles.", icon: <BreatheIcon />, color: "#10b981" },
    { title: "Crisis Guard", desc: "Immediate redirection to human support.", icon: <SafetyIcon />, color: "#ef4444" },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <PremiumHeader />
      
      <Container maxWidth="lg" sx={{ pt: 16 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
            Resilience <span className="gradient-text">Hub</span>
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Interactive tools based on Cognitive Behavioral Therapy (CBT) and Mindfulness.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card className="glass" sx={{ height: '100%', borderRadius: 6, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ 
                      width: 64, height: 64, borderRadius: 4, 
                      bgcolor: `${tool.color}15`, color: tool.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {tool.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{tool.title}</Typography>
                      <Typography color="text.secondary">{tool.desc}</Typography>
                    </Box>
                    <IconButton sx={{ color: 'primary.main' }}>
                      <ArrowIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Feature Promo */}
        <Box 
          className="glass" 
          sx={{ 
            mt: 6, p: 6, borderRadius: 8, 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Ready for an Assessment?</Typography>
          <Typography sx={{ opacity: 0.7, mb: 4, maxWidth: 600, mx: 'auto' }}>
            Take a clinically validated PHQ-9 or GAD-7 assessment to get a deeper understanding of your current mental health state.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ borderRadius: 4, px: 6, py: 2, fontWeight: 700 }}
          >
            Start PHQ-9 Assessment
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
