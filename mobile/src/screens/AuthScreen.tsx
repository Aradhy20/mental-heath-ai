import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { useAuth } from '../store/AuthContext'
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/tokens'
import { PrimaryButton } from '../components/PrimaryButton'

interface Props { onAuth: () => void }

export default function AuthScreen({ onAuth }: Props) {
  const { login, register } = useAuth()
  const [mode,     setMode]     = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { Alert.alert('Error', 'Email and password required'); return }
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!username) { Alert.alert('Error', 'Username required'); setLoading(false); return }
        await register(username, email, password)
      }
      onAuth()
    } catch (e: any) {
      Alert.alert('Authentication Failed', e?.message ?? 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🧠</Text>
          </View>
          <Text style={styles.logoTitle}>MindfulAI</Text>
          <Text style={styles.logoSub}>Your AI mental health companion</Text>
        </View>

        {/* Tab */}
        <View style={styles.tabRow}>
          {(['login', 'register'] as const).map((t) => (
            <TouchableOpacity
              key={t} onPress={() => setMode(t)}
              style={[styles.tab, mode === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, mode === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fields */}
        {mode === 'register' && (
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="your_username"
              placeholderTextColor={COLORS.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        )}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@email.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title={mode === 'login' ? 'Sign In →' : 'Create Account →'}
          loading={loading}
          onPress={handleSubmit}
          disabled={loading}
          style={{ marginTop: SPACING.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  scroll:       { flexGrow: 1, justifyContent: 'center', padding: SPACING['3xl'] },
  logoWrap:     { alignItems: 'center', marginBottom: SPACING['4xl'] },
  logoBadge:    { width: 80, height: 80, borderRadius: RADIUS['2xl'], backgroundColor: 'rgba(124,58,237,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  logoEmoji:    { fontSize: 40 },
  logoTitle:    { fontSize: 32, fontWeight: FONTS.black, color: COLORS.text, letterSpacing: -0.5 },
  logoSub:      { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs, fontWeight: FONTS.medium },
  tabRow:       { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 4, marginBottom: SPACING['2xl'], borderWidth: 1, borderColor: COLORS.border },
  tab:          { flex: 1, paddingVertical: 12, borderRadius: RADIUS.lg, alignItems: 'center' },
  tabActive:    { backgroundColor: COLORS.primary },
  tabText:      { color: COLORS.textMuted, fontWeight: FONTS.bold, fontSize: 14, textTransform: 'capitalize' },
  tabTextActive:{ color: '#fff' },
  fieldWrap:    { marginBottom: SPACING.lg },
  label:        { color: COLORS.textSecond, fontSize: 12, fontWeight: FONTS.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  input:        { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.lg, color: COLORS.text, fontSize: 15, fontWeight: FONTS.medium },
  btn:          { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginTop: SPACING.xl, shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  btnDisabled:  { opacity: 0.6 },
  btnText:      { color: '#fff', fontWeight: FONTS.black, fontSize: 16, letterSpacing: 0.5 },
})
