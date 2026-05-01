import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button, useTheme, IconButton, ProgressBar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <MaterialCommunityIcons name="heart" size={20} color="#fff" />
            </View>
            <Text style={styles.brandText}>MindfulAI</Text>
          </div>
          <View style={styles.appBarActions}>
             <TouchableOpacity style={styles.iconCircle}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#64748b" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconCircle}>
                <MaterialCommunityIcons name="account-outline" size={24} color="#64748b" />
             </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Welcome back, <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>Aradhya</Text>
            </Text>
            <Text style={styles.subGreeting}>Your mental wellness journey is progressing well.</Text>
          </View>

          {/* Main Stats Card */}
          <Surface style={styles.mainCard} elevation={0}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardLabel}>CURRENT MOOD</Text>
                  <Text style={styles.cardTitle}>Feeling Stable</Text>
                  <Text style={styles.cardSub}>Based on your last voice check-in</Text>
                </View>
                <View style={styles.moodIconContainer}>
                   <MaterialCommunityIcons name="emoticon-happy-outline" size={40} color="#fff" />
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Daily Goal</Text>
                  <Text style={styles.progressValue}>75%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '75%' }]} />
                </View>
              </View>

              <Button 
                mode="contained" 
                style={styles.chatButton}
                labelStyle={styles.chatButtonLabel}
                onPress={() => navigation.navigate('Chat')}
              >
                Talk to MindfulAI
              </Button>
            </LinearGradient>
          </Surface>

          {/* Quick Actions Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Toolkit</Text>
          </View>

          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={[styles.gridItem, { backgroundColor: '#fff' }]} 
              onPress={() => navigation.navigate('Mood')}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#f0fdf4' }]}>
                <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#22c55e" />
              </View>
              <Text style={styles.gridItemTitle}>Log Mood</Text>
              <Text style={styles.gridItemSub}>Quick check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, { backgroundColor: '#fff' }]}
              onPress={() => navigation.navigate('Journal')}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#eff6ff' }]}>
                <MaterialCommunityIcons name="book-open-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.gridItemTitle}>Journal</Text>
              <Text style={styles.gridItemSub}>Write thoughts</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.gridContainer, { marginTop: 16 }]}>
            <TouchableOpacity 
              style={[styles.gridItem, { backgroundColor: '#fff' }]}
              onPress={() => navigation.navigate('Insights')}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#faf5ff' }]}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#a855f7" />
              </View>
              <Text style={styles.gridItemTitle}>Insights</Text>
              <Text style={styles.gridItemSub}>View trends</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, { backgroundColor: '#fff' }]}
              onPress={() => navigation.navigate('Multimodal')}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#fff7ed' }]}>
                <MaterialCommunityIcons name="face-recognition" size={24} color="#f97316" />
              </View>
              <Text style={styles.gridItemTitle}>Face AI</Text>
              <Text style={styles.gridItemSub}>Real-time scan</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  greetingContainer: {
    marginBottom: 28,
  },
  greetingText: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '500',
  },
  subGreeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  mainCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: {
    padding: 28,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  cardSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  moodIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: 28,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  chatButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 6,
  },
  chatButtonLabel: {
    color: '#6366F1',
    fontWeight: '800',
    fontSize: 15,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  gridItemSub: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
