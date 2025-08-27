@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Link } from 'react-router-dom';
 import { Bot, MessageCircle, Star, Users } from 'lucide-react';
-import { supabase } from '../lib/supabase';
+// import { supabase } from '../lib/supabase';
 
 const Agents = () => {
-  const [agents, setAgents] = useState([]);
+  const [agents, setAgents] = useState([
+    {
+      id: 'serginho',
+      name: 'Serginho',
+      title: 'Especialista em Marketing Digital',
+      description: 'Expert em estratégias de marketing digital, SEO, redes sociais e campanhas publicitárias. Ajudo empresas a crescer online.',
+      avatar: '🚀',
+      specialties: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
+      rating: 4.9,
+      conversations: 1250
+    },
+    {
+      id: 'ana-dev',
+      name: 'Ana',
+      title: 'Desenvolvedora Full Stack',
+      description: 'Especialista em desenvolvimento web com React, Node.js e bancos de dados. Crio soluções completas e escaláveis.',
+      avatar: '💻',
+      specialties: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
+      rating: 4.8,
+      conversations: 980
+    },
+    {
+      id: 'carlos-design',
+      name: 'Carlos',
+      title: 'Designer UX/UI',
+      description: 'Designer experiente em criar interfaces intuitivas e experiências de usuário excepcionais. Foco em usabilidade e conversão.',
+      avatar: '🎨',
+      specialties: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
+      rating: 4.9,
+      conversations: 750
+    },
+    {
+      id: 'maria-dados',
+      name: 'Maria',
+      title: 'Cientista de Dados',
+      description: 'Especialista em análise de dados, machine learning e inteligência artificial. Transformo dados em insights valiosos.',
+      avatar: '📊',
+      specialties: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
+      rating: 4.7,
+      conversations: 650
+    },
+    {
+      id: 'pedro-vendas',
+      name: 'Pedro',
+      title: 'Consultor de Vendas',
+      description: 'Expert em estratégias de vendas, negociação e relacionamento com clientes. Ajudo a aumentar conversões e receita.',
+      avatar: '💼',
+      specialties: ['CRM', 'Negociação', 'Prospecção', 'Funil de Vendas'],
+      rating: 4.8,
+      conversations: 1100
+    },
+    {
+      id: 'lucia-rh',
+      name: 'Lúcia',
+      title: 'Especialista em RH',
+      description: 'Consultora em recursos humanos, recrutamento e desenvolvimento de talentos. Foco em cultura organizacional.',
+      avatar: '👥',
+      specialties: ['Recrutamento', 'Treinamento', 'Cultura', 'Performance'],
+      rating: 4.6,
+      conversations: 820
+    },
+    {
+      id: 'rafael-financas',
+      name: 'Rafael',
+      title: 'Consultor Financeiro',
+      description: 'Especialista em planejamento financeiro, investimentos e gestão de riscos. Ajudo na tomada de decisões financeiras.',
+      avatar: '💰',
+      specialties: ['Investimentos', 'Planejamento', 'Análise', 'Riscos'],
+      rating: 4.9,
+      conversations: 920
+    },
+    {
+      id: 'julia-conteudo',
+      name: 'Júlia',
+      title: 'Criadora de Conteúdo',
+      description: 'Especialista em criação de conteúdo, copywriting e storytelling. Crio narrativas que engajam e convertem.',
+      avatar: '✍️',
+      specialties: ['Copywriting', 'SEO Content', 'Social Media', 'Storytelling'],
+      rating: 4.8,
+      conversations: 1050
+    },
+    {
+      id: 'bruno-tech',
+      name: 'Bruno',
+      title: 'Arquiteto de Software',
+      description: 'Especialista em arquitetura de sistemas, DevOps e infraestrutura. Projeto soluções robustas e escaláveis.',
+      avatar: '⚙️',
+      specialties: ['Microservices', 'Docker', 'Kubernetes', 'Cloud'],
+      rating: 4.7,
+      conversations: 680
+    },
+    {
+      id: 'camila-legal',
+      name: 'Camila',
+      title: 'Consultora Jurídica',
+      description: 'Advogada especializada em direito empresarial, contratos e compliance. Protejo empresas de riscos legais.',
+      avatar: '⚖️',
+      specialties: ['Contratos', 'Compliance', 'LGPD', 'Societário'],
+      rating: 4.9,
+      conversations: 540
+    },
+    {
+      id: 'diego-produto',
+      name: 'Diego',
+      title: 'Product Manager',
+      description: 'Especialista em gestão de produtos digitais, roadmaps e estratégia. Transformo ideias em produtos de sucesso.',
+      avatar: '🚀',
+      specialties: ['Product Strategy', 'Roadmap', 'Analytics', 'User Stories'],
+      rating: 4.8,
+      conversations: 780
+    },
+    {
+      id: 'fernanda-saude',
+      name: 'Fernanda',
+      title: 'Consultora em Saúde',
+      description: 'Especialista em bem-estar corporativo, saúde mental e qualidade de vida. Promovo ambientes de trabalho saudáveis.',
+      avatar: '🏥',
+      specialties: ['Bem-estar', 'Saúde Mental', 'Ergonomia', 'Qualidade de Vida'],
+      rating: 4.7,
+      conversations: 620
+    }
+  ]);
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
-    fetchAgents();
+    // fetchAgents(); // Commented out for now, using static data
   }, []);
 
-  const fetchAgents = async () => {
-    try {
-      setLoading(true);
-      const { data, error } = await supabase
-        .from('agents')
-        .select('*')
-        .order('created_at', { ascending: false });
-
-      if (error) throw error;
-      setAgents(data || []);
-    } catch (error) {
-      console.error('Error fetching agents:', error);
-    } finally {
-      setLoading(false);
-    }
-  };
+  // const fetchAgents = async () => {
+  //   try {
+  //     setLoading(true);
+  //     const { data, error } = await supabase
+  //       .from('agents')
+  //       .select('*')
+  //       .order('created_at', { ascending: false });
+
+  //     if (error) throw error;
+  //     setAgents(data || []);
+  //   } catch (error) {
+  //     console.error('Error fetching agents:', error);
+  //   } finally {
+  //     setLoading(false);
+  //   }
+  // };
 
   if (loading) {
     return (