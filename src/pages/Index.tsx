
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, LineChartIcon, PieChart, Users, Sparkles, Zap, Shield } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentForm from '@/components/agents/AgentForm';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Card hover animation
const hoverAnimation = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 30px rgba(111, 78, 246, 0.2)",
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const Dashboard = () => {
  const { agents } = useVoiceAgent();
  const [activeTab, setActiveTab] = useState('analytics');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stats = [
    {
      title: "Total Agents",
      value: agents.length,
      icon: Users,
      change: "+12.5%",
      color: "text-primary",
      glowColor: "rgba(111, 78, 246, 0.7)"
    },
    {
      title: "Active Sessions",
      value: "324",
      icon: LineChartIcon,
      change: "+8.2%",
      color: "text-green-500",
      glowColor: "rgba(0, 255, 194, 0.7)"
    },
    {
      title: "Total Interactions",
      value: "12.5k",
      icon: BarChart,
      change: "+23.1%",
      color: "text-blue-500",
      glowColor: "rgba(0, 180, 219, 0.7)"
    },
    {
      title: "Success Rate",
      value: "95.2%",
      icon: PieChart,
      change: "+4.3%",
      color: "text-purple-500",
      glowColor: "rgba(189, 0, 255, 0.7)"
    }
  ];

  // Features for feature section
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Intelligence",
      description: "Our agents use cutting-edge AI models to deliver natural conversations."
    },
    {
      icon: Zap,
      title: "Lightning Fast Responses",
      description: "Optimized for speed with real-time processing capabilities."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and secure data handling procedures."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sound-wave">
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  style={{ height: `${Math.random() * 15 + 5}px` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="overflow-hidden feature-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      initial={{ scale: 1 }}
                      animate={hoveredCard === index ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className={`h-8 w-8 ${stat.color}`} style={{ 
                        filter: hoveredCard === index ? `drop-shadow(0 0 8px ${stat.glowColor})` : 'none'
                      }} />
                    </motion.div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analytics" className="text-lg relative group">
              Analytics
              {activeTab === 'analytics' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </TabsTrigger>
            <TabsTrigger value="create" className="text-lg relative group">
              Create Agent
              {activeTab === 'create' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="analytics" 
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="feature-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Agent Performance</h3>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                            className="w-12 h-12 rounded-full bg-primary/30"
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                    <p className="z-10">Analytics Charts will be implemented here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={hoverAnimation}
                    initial="rest"
                    whileHover="hover"
                    className="feature-card p-6 rounded-xl"
                  >
                    <motion.div 
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-12 h-12 text-primary mb-4 neo-glow" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent 
            value="create"
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AgentForm mode="create" />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
