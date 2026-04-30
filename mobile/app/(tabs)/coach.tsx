import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Bot, Send, User } from 'lucide-react-native';
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://regenx.eu';
type Message = { role: 'user' | 'assistant'; content: string; id: string };
export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>([{ id:'0', role:'assistant', content:'Bonjour! Je suis RegenX IA Coach. Comment puis-je vous aider?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const quickPrompts = ['Programme semaine','Plan nutrition','Conseils CBD','Ma progression'];
  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role:'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/ai/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: [...messages, userMsg].map(m=>({role:m.role,content:m.content})) }) });
      if (res.status === 402) { setMessages(prev => [...prev, { id:(Date.now()+1).toString(), role:'assistant', content:'Abonnement Premium requis (99EUR/mois).' }]); return; }
      if (!res.ok) throw new Error('err');
      const data = await res.json();
      setMessages(prev => [...prev, { id:(Date.now()+1).toString(), role:'assistant', content: data.content || 'OK' }]);
    } catch { setMessages(prev => [...prev, { id:(Date.now()+1).toString(), role:'assistant', content:'Erreur.' }]); }
    finally { setLoading(false); }
  };
  const renderMsg = ({ item }: { item: Message }) => (
    <View style={[styles.row, item.role==='user' && styles.rowUser]}>
      <View style={[styles.avatar, item.role==='assistant' ? styles.avatarBot : styles.avatarUser]}>
        {item.role==='assistant' ? <Bot size={16} color="#a78bfa" /> : <User size={16} color="#fff" />}
      </View>
      <View style={[styles.bubble, item.role==='user' ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.msgText, item.role==='user' && styles.msgTextUser]}>{item.content}</Text>
      </View>
    </View>
  );
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={90}>
      <View style={{paddingVertical:8}}>
        <FlatList horizontal data={quickPrompts} keyExtractor={i=>i} showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal:16,gap:8}}
          renderItem={({item}) => <TouchableOpacity style={styles.chip} onPress={() => sendMessage(item)}><Text style={styles.chipText}>{item}</Text></TouchableOpacity>}
        />
      </View>
      <FlatList ref={flatListRef} data={messages} keyExtractor={i=>i.id} renderItem={renderMsg} contentContainerStyle={{padding:16,gap:12}} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />
      {loading && <View style={{flexDirection:'row',alignItems:'center',gap:8,padding:16}}><ActivityIndicator size="small" color="#22c55e" /><Text style={{color:'#6b7280',fontSize:13}}>En train d ecrire...</Text></View>}
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Message..." placeholderTextColor="#6b7280" multiline />
        <TouchableOpacity style={[styles.sendBtn, (!input.trim()||loading)&&{opacity:0.4}]} onPress={() => sendMessage()} disabled={!input.trim()||loading}>
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#030712'},
  chip:{backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:20,paddingHorizontal:14,paddingVertical:8},
  chipText:{color:'#d1d5db',fontSize:12},
  row:{flexDirection:'row',gap:10},
  rowUser:{alignSelf:'flex-end',flexDirection:'row-reverse'},
  avatar:{width:32,height:32,borderRadius:10,alignItems:'center',justifyContent:'center'},
  avatarBot:{backgroundColor:'rgba(167,139,250,0.2)',borderWidth:1,borderColor:'rgba(167,139,250,0.3)'},
  avatarUser:{backgroundColor:'#22c55e'},
  bubble:{borderRadius:16,paddingHorizontal:14,paddingVertical:10,maxWidth:'80%'},
  bubbleBot:{backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)'},
  bubbleUser:{backgroundColor:'#22c55e'},
  msgText:{color:'#e5e7eb',fontSize:14,lineHeight:20},
  msgTextUser:{color:'#fff'},
  inputRow:{flexDirection:'row',gap:10,padding:16,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.05)',backgroundColor:'#030712'},
  input:{flex:1,backgroundColor:'rgba(255,255,255,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:12,paddingHorizontal:14,paddingVertical:10,color:'#fff',fontSize:14,maxHeight:100},
  sendBtn:{backgroundColor:'#22c55e',borderRadius:12,width:46,alignItems:'center',justifyContent:'center'},
});
