
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Bot, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const History = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Demo conversation history
  const conversations = [
    {
      id: 'conv-1',
      agentName: 'Customer Support',
      date: '2025-04-27T14:30:00',
      duration: '4:32',
      status: 'completed',
      summary: 'Helped user troubleshoot login issues',
      messages: 12
    },
    {
      id: 'conv-2',
      agentName: 'Sales Assistant',
      date: '2025-04-26T10:15:00',
      duration: '6:45',
      status: 'completed',
      summary: 'Provided information about premium plans',
      messages: 18
    },
    {
      id: 'conv-3',
      agentName: 'Technical Support',
      date: '2025-04-25T16:20:00',
      duration: '8:12',
      status: 'completed',
      summary: 'Resolved network connectivity problems',
      messages: 24
    },
    {
      id: 'conv-4',
      agentName: 'Product Advisor',
      date: '2025-04-24T11:05:00',
      duration: '3:18',
      status: 'completed',
      summary: 'Recommended products based on user preferences',
      messages: 9
    },
    {
      id: 'conv-5',
      agentName: 'Booking Assistant',
      date: '2025-04-23T13:45:00',
      duration: '5:26',
      status: 'completed',
      summary: 'Scheduled appointment for consultation',
      messages: 15
    }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold neon-text mb-1">Conversation History</h1>
            <p className="text-muted-foreground">Review past voice agent interactions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Conversations</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="feature-card hover:cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span>{conv.agentName}</span>
                      </div>
                      <div className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(conv.date)}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Duration: {conv.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Messages: {conv.messages}</span>
                      </div>
                      <div className="md:text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{conv.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {conversations.slice(0, 2).map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="feature-card hover:cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span>{conv.agentName}</span>
                      </div>
                      <div className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(conv.date)}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Duration: {conv.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Messages: {conv.messages}</span>
                      </div>
                      <div className="md:text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{conv.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="flagged">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Flagged Conversations</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't flagged any conversations for review yet. Important conversations will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default History;
