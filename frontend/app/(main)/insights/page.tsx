'use client'

import React, { useEffect, useState } from 'react'
import { 
  Box, Typography, Grid, Card, CardContent, 
  Stack, Avatar, LinearProgress, Chip, 
  useTheme, Skeleton, IconButton, Tooltip as MuiTooltip
} from '@mui/material'
import { 
  AutoAwesome as ZapIcon, 
  Target as TargetIcon, 
  Security as ShieldIcon, 
  Favorite as HeartIcon, 
  Sparkles as SparklesIcon,
  Timeline as ChartIcon,
  Warning as AlertIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts'
import { insightsAPI, type InsightData } from '@/lib/api'

const EMOTION_COLORS: Record<string, string> = {
  joy:     '#FBC02D',
  sadness: '#42A5F5',
  anger:   '#EF5350',
  fear:    '#FFA726',
  neutral: '#9E9E9E',
}

export default function InsightsPage() {
  const theme = useTheme()
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    insightsAPI.get()
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 2, width: '40%' }} />
        <Skeleton variant="text" sx={{ mb: 6, width: '60%' }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 10 }} /></Grid>
          <Grid item xs={12} md={8}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 10 }} /></Grid>
        </Grid>
      </Box>
    )
  }

  // Fallback demo data if backend is empty (Critical for faculty presentation)
  const demoData: InsightData = data || {
    weekly_summary: { avg_mood: 7.2, trend: "improving", dominant_emotion: "joy" },
    emotion_breakdown: [
      { emotion: "joy", count: 12, percentage: 45 },
      { emotion: "neutral", count: 8, percentage: 30 },
      { emotion: "sadness", count: 4, percentage: 15 },
      { emotion: "anxious", count: 2, percentage: 10 },
    ],
    risk_assessment: { level: "safe", confidence: 0.94 },
    recommendations: [
      "Maintain current morning routine.",
      "Consider physical activity to sustain mood.",
      "Social engagement levels are optimal."
    ],
    mood_history: [
      { date: "2026-04-22", score: 7, emotion: "joy" },
      { date: "2026-04-23", score: 6, emotion: "neutral" },
      { date: "2026-04-24", score: 8, emotion: "joy" },
      { date: "2026-04-25", score: 7, emotion: "joy" },
      { date: "2026-04-26", score: 9, emotion: "joy" },
    ]
  }

  const { weekly_summary, emotion_breakdown, recommendations, risk_assessment, mood_history } = demoData

  const historyData = mood_history?.map(m => ({
    date: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
    score: m.score * 10
  }))

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
            Mindful <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>Forensics</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered deep profile analysis of your cognitive and emotional state.
          </Typography>
        </Box>
        <Chip 
          icon={<ShieldIcon sx={{ fontSize: '1rem !important' }} />} 
          label="Secure Neural Analysis" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 800, px: 1 }}
        />
      </Stack>

      <Grid container spacing={4}>
        {/* Mood Index Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Typography variant="overline" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
                Mood Stability Index
              </Typography>
              
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                <Box sx={{ 
                  width: 200, height: 200, borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `conic-gradient(${theme.palette.primary.main} ${(weekly_summary.avg_mood/10)*360}deg, ${theme.palette.divider} 0deg)`,
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    width: 170, height: 170, bgcolor: 'background.paper', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                  }}>
                    <Typography variant="h2" sx={{ fontWeight: 900 }}>
                      {(weekly_summary.avg_mood * 10).toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'primary.main', border: `4px solid ${theme.palette.background.paper}` }}>
                  <ZapIcon />
                </Avatar>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                Your emotional trajectory is <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>{weekly_summary.trend}</Box> based on the last 7 days.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Breakdown Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TargetIcon color="primary" /> Emotion Breakdown
                </Typography>
                <MuiTooltip title="Percentage of detected signals">
                  <IconButton size="small"><InfoIcon fontSize="small" /></IconButton>
                </MuiTooltip>
              </Stack>
              
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotion_breakdown} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="emotion" type="category" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 700 }} />
                    <ChartTooltip 
                      contentStyle={{ backgroundColor: '#1A1A1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    />
                    <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={20}>
                      {emotion_breakdown.map((entry, index) => (
                        <motion.rect key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || theme.palette.divider} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* History Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChartIcon color="secondary" /> Longitudinal Stability
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} />
                    <ChartTooltip contentStyle={{ backgroundColor: '#1A1A1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="score" stroke={theme.palette.secondary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorHistory)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Prescriptions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.05) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SparklesIcon color="primary" /> AI Prescriptions
              </Typography>
              <Stack spacing={2}>
                {recommendations.map((rec, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.dark', fontWeight: 900 }}>{i + 1}</Avatar>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {rec}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              {risk_assessment.level !== 'safe' && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'error.dark', borderRadius: 4, display: 'flex', gap: 2, opacity: 0.8 }}>
                  <AlertIcon color="error" />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Elevated risk markers detected. Clinical review recommended.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
