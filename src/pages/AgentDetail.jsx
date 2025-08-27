@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import { ArrowLeft, MessageCircle, Star, Award, Users, Clock } from 'lucide-react';
-import { supabase } from '../lib/supabase';
+// import { supabase } from '../lib/supabase';
+
+// Static agents data for testing
+const agentsData = {
+  'serginho': {
+    id: 'serginho',
+    name: 'Serginho',
+    title: 'Especialista em Marketing Digital',
+    description: 'Expert em estratégias de marketing digital, SEO, redes sociais e campanhas publicitárias. Ajudo empresas a crescer online com técnicas comprovadas e resultados mensuráveis.',
+    avatar: '🚀',
+    specialties: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
+    rating: 4.9,
+    conversations: 1250,
+    experience: '8 anos',
+    responseTime: '< 5 min'
+  },
+  'ana-dev': {
+    id: 'ana-dev',
+    name: 'Ana',
+    title: 'Desenvolvedora Full Stack',
+    description: 'Especialista em desenvolvimento web com React, Node.js e bancos de dados. Crio soluções completas e escaláveis para empresas de todos os tamanhos.',
+    avatar: '💻',
+    specialties: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
+    rating: 4.8,
+    conversations: 980,
+    experience: '6 anos',
+    responseTime: '< 10 min'
+  },
+  'carlos-design': {
+    id: 'carlos-design',
+    name: 'Carlos',
+    title: 'Designer UX/UI',
+    description: 'Designer experiente em criar interfaces intuitivas e experiências de usuário excepcionais. Foco em usabilidade e conversão.',
+    avatar: '🎨',
+    specialties: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
+    rating: 4.9,
+    conversations: 750,
+    experience: '7 anos',
+    responseTime: '< 15 min'
+  }
+};
 
 const AgentDetail = () => {
   const { id } = useParams();
-  const [agent, setAgent] = useState(null);
+  const [agent, setAgent] = useState(agentsData[id] || null);
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
-    if (id) {
-      fetchAgent();
-    }
+    // Set agent from static data
+    setAgent(agentsData[id] || null);
   }, [id]);
 
-  const fetchAgent = async () => {
-    try {
-      setLoading(true);
-      const { data, error } = await supabase
-        .from('agents')
-        .select('*')
-        .eq('id', id)
-        .single();
-
-      if (error) throw error;
-      setAgent(data);
-    } catch (error) {
-      console.error('Error fetching agent:', error);
-      setAgent(null);
-    } finally {
-      setLoading(false);
-    }
-  };
+  // const fetchAgent = async () => {
+  //   try {
+  //     setLoading(true);
+  //     const { data, error } = await supabase
+  //       .from('agents')
+  //       .select('*')
+  //       .eq('id', id)
+  //       .single();
+
+  //     if (error) throw error;
+  //     setAgent(data);
+  //   } catch (error) {
+  //     console.error('Error fetching agent:', error);
+  //     setAgent(null);
+  //   } finally {
+  //     setLoading(false);
+  //   }
+  // };
 
   if (loading) {
     return (
@@ .. @@
   if (!agent) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
-        <div className="text-center">
+        <div className="text-center p-8">
           <h1 className="text-2xl font-bold text-gray-900 mb-4">Agente não encontrado</h1>
-          <p className="text-gray-600 mb-6">O agente que você está procurando não existe.</p>
+          <p className="text-gray-600 mb-6">O agente "{id}" não foi encontrado.</p>
           <Link
             to="/agents"
             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
@@ .. @@
                 <div className="flex items-center space-x-4 mb-6">
                   <div className="text-6xl">{agent.avatar}</div>
                   <div>
-                    <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
-                    <p className="text-xl text-gray-600">{agent.role || agent.title}</p>
+                    <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
+                    <p className="text-xl text-gray-600">{agent.title}</p>
                     <div className="flex items-center mt-2">
                       <Star className="w-5 h-5 text-yellow-400 fill-current" />
                       <span className="ml-1 text-gray-700 font-medium">{agent.rating}</span>
@@ .. @@
                 </div>
 
                 <div className="mb-8">
-                  <p className="text-gray-700 text-lg leading-relaxed">{agent.description}</p>
+                  <p className="text-gray-700 text-lg leading-relaxed">{agent.description}</p>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
@@ .. @@
                     <div className="flex items-center">
                       <Clock className="w-5 h-5 text-gray-400 mr-2" />
                       <div>
-                        <p className="text-sm text-gray-500">Tempo de resposta</p>
-                        <p className="font-medium">< 5 min</p>
+                        <p className="text-sm text-gray-500">Tempo de resposta</p>
+                        <p className="font-medium">{agent.responseTime}</p>
                       </div>
                     </div>
                   </div>
@@ .. @@
                     <div className="flex items-center">
                       <Award className="w-5 h-5 text-gray-400 mr-2" />
                       <div>
-                        <p className="text-sm text-gray-500">Experiência</p>
-                        <p className="font-medium">5+ anos</p>
+                        <p className="text-sm text-gray-500">Experiência</p>
+                        <p className="font-medium">{agent.experience}</p>
                       </div>
                     </div>
                   </div>
@@ .. @@
                 <div className="mb-8">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h3>
                   <div className="flex flex-wrap gap-2">
-                    {(agent.specialties || []).map((specialty, index) => (
+                    {agent.specialties.map((specialty, index) => (
                       <span
                         key={index}
                         className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"