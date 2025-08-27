import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Star, Users } from 'lucide-react';
// import { supabase } from '../lib/supabase';

const Agents = () => {
  const [agents, setAgents] = useState([
    {
      id: 'serginho',
      name: 'Serginho',
      title: 'Especialista em Marketing Digital',
      description: 'Expert em estratégias de marketing digital, SEO, redes sociais e campanhas publicitárias. Ajudo empresas a crescer online.',
      avatar: '🚀',
      specialties: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
      rating: 4.9,
      conversations: 1250
    },
    {
      id: 'ana-dev',
      name: 'Ana',
      title: 'Desenvolvedora Full Stack',
      description: 'Especialista em desenvolvimento web com React, Node.js e bancos de dados. Crio soluções completas e escaláveis.',
      avatar: '💻',
      specialties: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      rating: 4.8,
      conversations: 980
    },
    {
      id: 'carlos-design',
      name: 'Carlos',
      title: 'Designer UX/UI',
      description: 'Designer experiente em criar interfaces intuitivas e experiências de usuário excepcionais. Foco em usabilidade e conversão.',
      avatar: '🎨',
      specialties: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
      rating: 4.9,
      conversations: 750
    },
    {
      id: 'maria-dados',
      name: 'Maria',
      title: 'Cientista de Dados',
      description: 'Especialista em análise de dados, machine learning e inteligência artificial. Transformo dados em insights valiosos.',
      avatar: '📊',
      specialties: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
      rating: 4.7,
      conversations: 650
    },
    {
      id: 'pedro-vendas',
      name: 'Pedro',
      title: 'Consultor de Vendas',
      description: 'Expert em estratégias de vendas, negociação e relacionamento com clientes. Ajudo a aumentar conversões e receita.',
      avatar: '💼',
      specialties: ['CRM', 'Negociação', 'Prospecção', 'Funil de Vendas'],
      rating: 4.8,
      conversations: 1100
    },
    {
      id: 'lucia-rh',
      name: 'Lúcia',
      title: 'Especialista em RH',
      description: 'Consultora em recursos humanos, recrutamento e desenvolvimento de talentos. Foco em cultura organizacional.',
      avatar: '👥',
      specialties: ['Recrutamento', 'Treinamento', 'Cultura', 'Performance'],
      rating: 4.6,
      conversations: 820
    },
    {
      id: 'rafael-financas',
      name: 'Rafael',
      title: 'Consultor Financeiro',
      description: 'Especialista em planejamento financeiro, investimentos e gestão de riscos. Ajudo na tomada de decisões financeiras.',
      avatar: '💰',
      specialties: ['Investimentos', 'Planejamento', 'Análise', 'Riscos'],
      rating: 4.9,
      conversations: 920
    },
    {
      id: 'julia-conteudo',
      name: 'Júlia',
      title: 'Criadora de Conteúdo',
      description: 'Especialista em criação de conteúdo, copywriting e storytelling. Crio narrativas que engajam e convertem.',
      avatar: '✍️',
      specialties: ['Copywriting', 'SEO Content', 'Social Media', 'Storytelling'],
      rating: 4.8,
      conversations: 1050
    },
    {
      id: 'bruno-tech',
      name: 'Bruno',
      title: 'Arquiteto de Software',
      description: 'Especialista em arquitetura de sistemas, DevOps e infraestrutura. Projeto soluções robustas e escaláveis.',
      avatar: '⚙️',
      specialties: ['Microservices', 'Docker', 'Kubernetes', 'Cloud'],
      rating: 4.7,
      conversations: 680
    },
    {
      id: 'camila-legal',
      name: 'Camila',
      title: 'Consultora Jurídica',
      description: 'Advogada especializada em direito empresarial, contratos e compliance. Protejo empresas de riscos legais.',
      avatar: '⚖️',
      specialties: ['Contratos', 'Compliance', 'LGPD', 'Societário'],
      rating: 4.9,
      conversations: 540
    },
    {
      id: 'diego-produto',
      name: 'Diego',
      title: 'Product Manager',
      description: 'Especialista em gestão de produtos digitais, roadmaps e estratégia. Transformo ideias em produtos de sucesso.',
      avatar: '🚀',
      specialties: ['Product Strategy', 'Roadmap', 'Analytics', 'User Stories'],
      rating: 4.8,
      conversations: 780
    },
    {
      id: 'fernanda-saude',
      name: 'Fernanda',
      title: 'Consultora em Saúde',
      description: 'Especialista em bem-estar corporativo, saúde mental e qualidade de vida. Promovo ambientes de trabalho saudáveis.',
      avatar: '🏥',
      specialties: ['Bem-estar', 'Saúde Mental', 'Ergonomia', 'Qualidade de Vida'],
      rating: 4.7,
      conversations: 620
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetchAgents(); // Commented out for now, using static data
  }, []);

  // const fetchAgents = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from('agents')
  //       .select('*')
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;
  //     setAgents(data || []);
  //   } catch (error) {
  //     console.error('Error fetching agents:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando agentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Agentes Especialistas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Converse com especialistas em diversas áreas e obtenha insights valiosos 
            para o seu negócio. Cada agente é treinado com conhecimento específico 
            da sua área de expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{agent.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-blue-600 font-medium">{agent.title}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{agent.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {agent.specialties.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{agent.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700 font-medium">{agent.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{agent.conversations.toLocaleString()} conversas</span>
                  </div>
                </div>

                <Link
                  to={`/chat/${agent.id}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Conversar com {agent.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Não encontrou o especialista que procura?
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa IA pode ajudar com uma ampla variedade de tópicos. 
              Comece uma conversa e descubra como podemos ajudar!
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Conversar com IA Geral
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;