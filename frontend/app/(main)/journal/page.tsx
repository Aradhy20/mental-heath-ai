'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, Typography, Grid2 as Grid, Card, CardContent, 
  Stack, Avatar, IconButton, TextField, 
  Button, useTheme, Chip, List, ListItem, 
  ListItemText, ListItemAvatar, Divider,
  InputBase, Paper, Skeleton, LinearProgress
} from '@mui/material'
import { 
  Book as BookIcon, 
  Search as SearchIcon, 
  CalendarToday as CalendarIcon, 
  AutoAwesome as SparklesIcon, 
  ChevronRight as ChevronRightIcon,
  Add as PlusIcon, 
  SentimentVerySatisfied as SmileIcon, 
  SentimentNeutral as MehIcon, 
  SentimentVeryDissatisfied as FrownIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { journalAPI, type JournalRecord } from '@/lib/api'

export default function JournalPage() {
  const theme = useTheme()
  const [entries, setEntries] = useState<JournalRecord[]>([])
  const [activeEntry, setActiveEntry] = useState<JournalRecord | null>(null)
  const [content, setContent] = useState('')
  const [moodTag, setMoodTag] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const data = await journalAPI.list()
      setEntries(data)
      if (data.length > 0 && !activeEntry && !isDraft) {
        setActiveEntry(data[0])
        setContent(data[0].content)
        setMoodTag(data[0].mood_tag || '')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  const handleNewDraft = () => {
    setIsDraft(true)
    setActiveEntry(null)
    setContent('')
    setMoodTag('')
  }

  const handleSelectEntry = (entry: JournalRecord) => {
    setIsDraft(false)
    setActiveEntry(entry)
    setContent(entry.content)
    setMoodTag(entry.mood_tag || '')
  }

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      await journalAPI.create({ content: content.trim(), mood_tag: moodTag || undefined })
      await fetchEntries()
      setIsDraft(false)
    } finally {
      setSaving(false)
    }
  }

  const getMoodIcon = (tag?: string) => {
    if (!tag) return <MehIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
    if (tag.toLowerCase().includes('happy')) return <SmileIcon sx={{ color: 'success.main', fontSize: 18 }} />
    if (tag.toLowerCase().includes('sad')) return <FrownIcon sx={{ color: 'error.main', fontSize: 18 }} />
    return <MehIcon sx={{ color: 'warning.main', fontSize: 18 }} />
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', h: 'calc(100vh - 120px)', py: 2 }}>
      <Grid container spacing={3} sx={{ h: '100%' }}>
        {/* Sidebar: Entries List */}
        <Grid size={{ xs: 12, md: 3.5 }} sx={{ h: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}><BookIcon sx={{ fontSize: 18 }} /></Avatar>
              Journal
            </Typography>
            <IconButton onClick={handleNewDraft} color="primary" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
              <PlusIcon />
            </IconButton>
          </Stack>

          <Paper sx={{ p: '2px 12px', display: 'flex', alignItems: 'center', borderRadius: 8, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 600 }} placeholder="Search chronicles..." />
          </Paper>

          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 6 }} />
                ))
              ) : entries.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>No entries yet.</Typography>
              ) : (
                entries.map((entry) => (
                  <ListItem 
                    key={entry.id} 
                    disablePadding 
                    onClick={() => handleSelectEntry(entry)}
                    sx={{ 
                      borderRadius: 6, 
                      bgcolor: activeEntry?.id === entry.id && !isDraft ? 'rgba(208, 188, 255, 0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: activeEntry?.id === entry.id && !isDraft ? 'primary.main' : 'rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    <CardContent sx={{ p: '16px !important', width: '100%' }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                          {new Date(entry.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </Typography>
                        {getMoodIcon(entry.mood_tag)}
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {entry.content}
                      </Typography>
                      {entry.emotion_analysis?.emotion && (
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', mt: 1, display: 'block' }}>
                          {entry.emotion_analysis.emotion}
                        </Typography>
                      )}
                    </CardContent>
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Grid>

        {/* Main: Editor */}
        <Grid size={{ xs: 12, md: 5.5 }} sx={{ h: '100%' }}>
          <Card sx={{ h: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', sx: { justifyContent: 'space-between', alignItems: 'center' } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }}><CalendarIcon /></Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {isDraft ? 'New Chronicle' : new Date(activeEntry?.created_at || Date.now()).toLocaleDateString('en', { month: 'long', day: 'numeric' })}
                  </Typography>
                  <InputBase 
                    placeholder="Mood tag..." 
                    value={moodTag}
                    onChange={e => setMoodTag(e.target.value)}
                    disabled={!isDraft}
                    sx={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'primary.main' }}
                  />
                </Box>
              </Stack>
              {isDraft && (
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  sx={{ borderRadius: 4 }}
                >
                  Save
                </Button>
              )}
            </Box>
            <Box sx={{ flex: 1, p: 4 }}>
              <TextField
                multiline
                fullWidth
                variant="standard"
                placeholder="Unfold your mind..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isDraft}
                slotProps={{ 
                  input: { 
                    disableUnderline: true, 
                    sx: { fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.8 } 
                  }
                }}
                sx={{ h: '100%' }}
              />
            </Box>
          </Card>
        </Grid>

        {/* AI Insight Sidebar */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ h: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.1) 0%, transparent 100%)',
            position: 'relative', overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}><SparklesIcon sx={{ fontSize: 100 }} /></Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 900, mb: 2, display: 'block' }}>AI Cognitive Scan</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                {activeEntry?.emotion_analysis?.emotion 
                  ? `Emotional resonance detected: ${activeEntry.emotion_analysis.emotion.toUpperCase()}.`
                  : "Save your entry for an AI emotional breakdown."}
              </Typography>
              {activeEntry?.emotion_analysis?.emotion && (
                <Stack spacing={1}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>Clarity Index</Typography>
                  <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3 }} />
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900, mb: 2, display: 'block' }}>Recommended Reflection</Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Deep Breathing Routine</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Unlock focus and reduce amygdala activation.</Typography>
                <Button fullWidth size="small" variant="outlined" endIcon={<PlayIcon />}>Begin Flow</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
