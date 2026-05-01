import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { createClient } from '../../../lib/supabase/client';

type Profile = {
  full_name: string | null;
  fitness_level: string | null;
};

type Subscription = {
  status: string | null;
  stripe_customer_id: string | null;
};

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    setEmail(user.email || null);

    const [profileRes, subRes, workoutsRes] = await Promise.all([
      supabase.from('profiles').select('full_name, fitness_level').eq('id', user.id).single(),
      supabase.from('subscriptions').select('status, stripe_customer_id').eq('user_id', user.id).single(),
      supabase.from('workouts').select('id, completed_at').eq('user_id', user.id),
    ]);

    setProfile(profileRes.data);
    setSubscription(subRes.data);
    setWorkoutCount(workoutsRes.data?.length || 0);
    setCompletedCount(workoutsRes.data?.filter(w => w.completed_at)?.length || 0);
    setLoading(false);
  }

  async function handleLogout() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.name}>{profile?.full_name || email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déco.</Text>
        </TouchableOpacity>
      </View>

      {!isActive && (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumTitle}>🚀 Débloque RegenX Premium</Text>
          <Text style={styles.premiumText}>
            Coach IA, programmes personnalisés, nutrition. 99€/mois.
          </Text>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>S'abonner →</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutCount}</Text>
          <Text style={styles.statLabel}>Programmes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#059669' }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Complétés</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: isActive ? '#059669' : '#94a3b8' }]}>
            {isActive ? '✓' : '—'}
          </Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Accès rapide</Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={[styles.quickCard, styles.quickCardPrimary]}
          onPress={() => router.push('/(tabs)/coach')}
        >
          <Text style={styles.quickCardIcon}>🤖</Text>
          <Text style={[styles.quickCardTitle, { color: '#ffffff' }]}>Coach IA</Text>
          <Text style={[styles.quickCardSub, { color: 'rgba(255,255,255,0.8)' }]}>
            Parle avec ton coach
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/(tabs)/workouts')}
        >
          <Text style={styles.quickCardIcon}>💪</Text>
          <Text style={styles.quickCardTitle}>Programmes</Text>
          <Text style={styles.quickCardSub}>{workoutCount} créé(s)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/(tabs)/progress')}
        >
          <Text style={styles.quickCardIcon}>📈</Text>
          <Text style={styles.quickCardTitle}>Progression</Text>
          <Text style={styles.quickCardSub}>Voir mes stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.levelCard}>
        <Text style={styles.levelLabel}>Niveau fitness</Text>
        <Text style={styles.levelValue}>
          {profile?.fitness_level === 'beginner' ? '🟢 Débutant'
           : profile?.fitness_level === 'intermediate' ? '🟡 Intermédiaire'
           : profile?.fitness_level === 'advanced' ? '🔴 Avancé'
           : '— Non défini'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  greeting: { fontSize: 14, color: '#64748b' },
  name: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginTop: 2 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f1f5f9', borderRadius: 8 },
  logoutText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  premiumBanner: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fefce8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  premiumTitle: { fontSize: 16, fontWeight: '700', color: '#92400e', marginBottom: 4 },
  premiumText: { fontSize: 13, color: '#b45309', marginBottom: 12 },
  premiumBtn: { backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  premiumBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  quickGrid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickCardPrimary: { backgroundColor: '#059669', width: '100%' },
  quickCardIcon: { fontSize: 28, marginBottom: 8 },
  quickCardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  quickCardSub: { fontSize: 12, color: '#64748b' },
  levelCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  levelLabel: { fontSize: 14, color: '#64748b' },
  levelValue: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
});
