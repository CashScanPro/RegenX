import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, gdpr_consent: true } } });
    setLoading(false);
    if (error) Alert.alert('Erreur', error.message);
    else router.replace('/(tabs)');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RegenX</Text>
      <Text style={styles.subtitle}>Creer un compte</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom complet" placeholderTextColor="#6b7280" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#6b7280" keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mot de passe (min 8 car.)" placeholderTextColor="#6b7280" secureTextEntry />
      <View style={styles.switchRow}>
        <Switch value={gdpr} onValueChange={setGdpr} trackColor={{false:'#374151',true:'#22c55e'}} />
        <Text style={styles.switchLabel}>J accepte la politique de confidentialite (RGPD)</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creation...' : 'Creer mon compte'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Deja un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#030712',padding:24,justifyContent:'center'},
  title:{color:'#22c55e',fontSize:32,fontWeight:'bold',textAlign:'center',marginBottom:8},
  subtitle:{color:'#9ca3af',fontSize:18,textAlign:'center',marginBottom:32},
  input:{backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:12,paddingHorizontal:16,paddingVertical:14,color:'#fff',fontSize:16,marginBottom:12},
  switchRow:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16},
  switchLabel:{color:'#9ca3af',fontSize:13,flex:1},
  btn:{backgroundColor:'#22c55e',borderRadius:12,padding:16,alignItems:'center'},
  btnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  link:{color:'#22c55e',textAlign:'center',marginTop:16,fontSize:14},
});