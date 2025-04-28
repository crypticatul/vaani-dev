
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, LineChartIcon, PieChart, Users } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import AgentForm from '@/components/agents/AgentForm';
import { Button } from '@/components/ui/button';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const Dashboard = () => {
  const { agents } = useVoiceAgent();
  const [activeTab, setActiveTab] = useState('analytics');

  const stats = [
    {
      title: "Total Agents",
      value: agents.length,
      icon: Users,
      change: "+12.5%",
      color: "text-primary"
    },
    {
      title: "Active Sessions",
      value: "324",
      icon: LineChartIcon,
      change: "+8.2%",
      color: "text-green-500"
    },
    {
      title: "Total Interactions",
      value: "12.5k",
      icon: BarChart,
      change: "+23.1%",
      color: "text-blue-500"
    },
    {
      title: "Success Rate",
      value: "95.2%",
      icon: PieChart,
      change: "+4.3%",
      color: "text-purple-500"
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
        <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden feature-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
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
            <TabsTrigger value="analytics" className="text-lg">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="create" className="text-lg">
              Create Agent
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
              transition={{ duration: 0.3 }}
            >
              <Card className="feature-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Agent Performance</h3>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Analytics Charts will be implemented here
                  </div>
                </CardContent>
              </Card>
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
              transition={{ duration: 0.3 }}
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
