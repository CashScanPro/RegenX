import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Erreur', error.message);
    else router.replace('/(tabs)');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RegenX</Text>
      <Text style={styles.subtitle}>Connexion</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#6b7280" keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mot de passe" placeholderTextColor="#6b7280" secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Pas de compte ? Creer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#030712',padding:24,justifyContent:'center'},
  title:{color:'#22c55e',fontSize:32,fontWeight:'bold',textAlign:'center',marginBottom:8},
  subtitle:{color:'#9ca3af',fontSize:18,textAlign:'center',marginBottom:32},
  input:{backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:12,paddingHorizontal:16,paddingVertical:14,color:'#fff',fontSize:16,marginBottom:12},
  btn:{backgroundColor:'#22c55e',borderRadius:12,padding:16,alignItems:'center',marginTop:8},
  btnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  link:{color:'#22c55e',textAlign:'center',marginTop:16,fontSize:14},
});