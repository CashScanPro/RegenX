import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react-native';
export default function ProgressScreen() {
  const stats = [
    { label: 'Poids actuel', value: '-- kg', color: '#22c55e', icon: TrendingUp },
    { label: 'Objectif', value: '-- kg', color: '#f97316', icon: Target },
    { label: 'Seances totales', value: '0', color: '#a78bfa', icon: Calendar },
    { label: 'Streak', value: '0 jours', color: '#eab308', icon: Award },
  ];
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ma Progression</Text>
      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.card}>
            <s.icon size={24} color={s.color} />
            <Text style={[styles.value, {color: s.color}]}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#030712'},
  content:{padding:20,paddingBottom:40},
  title:{color:'#fff',fontSize:24,fontWeight:'bold',marginBottom:20},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginBottom:24},
  card:{width:'47%',backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16,alignItems:'center',gap:8},
  value:{fontSize:20,fontWeight:'bold'},
  label:{color:'#9ca3af',fontSize:12,textAlign:'center'},
  emptyChart:{backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,padding:32,alignItems:'center'},
  emptyText:{color:'#6b7280',textAlign:'center',lineHeight:22},
});