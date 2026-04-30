import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dumbbell, Plus, Zap } from 'lucide-react-native';
export default function WorkoutsScreen() {
  const workoutTypes = [
    { name: 'Force', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', desc: 'Musculation & force' },
    { name: 'Cardio', color: '#f97316', bg: 'rgba(249,115,22,0.1)', desc: 'Endurance & cardio' },
    { name: 'HIIT', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', desc: 'Haute intensite' },
    { name: 'Yoga', color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)', desc: 'Flexibilite' },
  ];
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.generateBtn}>
        <Zap size={20} color="#fff" />
        <Text style={styles.generateBtnText}>Generer un programme IA</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Types</Text>
      {workoutTypes.map((t) => (
        <TouchableOpacity key={t.name} style={styles.card}>
          <View style={[styles.iconBox,{backgroundColor:t.bg}]}>
            <Dumbbell size={24} color={t.color} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t.name}</Text>
            <Text style={styles.cardDesc}>{t.desc}</Text>
          </View>
          <Plus size={20} color="#6b7280" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#030712'},
  content:{padding:20,paddingBottom:40},
  generateBtn:{backgroundColor:'#22c55e',borderRadius:16,padding:18,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginBottom:24},
  generateBtnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  sectionTitle:{color:'#fff',fontSize:18,fontWeight:'700',marginBottom:12},
  card:{backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16,flexDirection:'row',alignItems:'center',gap:14,marginBottom:10},
  iconBox:{width:48,height:48,borderRadius:12,alignItems:'center',justifyContent:'center'},
  cardContent:{flex:1},
  cardTitle:{color:'#fff',fontSize:15,fontWeight:'600'},
  cardDesc:{color:'#9ca3af',fontSize:13,marginTop:2},
});
