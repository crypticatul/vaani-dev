import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAgent, Agent } from '@/hooks/useVoiceAgent';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Upload, Globe, FileText, FileQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters'),
  gender: z.enum(['male', 'female', 'neutral']),
  knowledgeBaseType: z.enum(['none', 'url', 'file', 'text']).default('none'),
  knowledgeBaseUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  knowledgeBaseText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AgentFormProps {
  existingAgent?: Agent;
  mode: 'create' | 'edit';
}

const AgentForm = ({ existingAgent, mode }: AgentFormProps) => {
  const navigate = useNavigate();
  const { createAgent, updateAgent } = useVoiceAgent();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with existing agent data or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingAgent?.name || '',
      systemPrompt: existingAgent?.systemPrompt || '',
      gender: existingAgent?.gender || 'neutral',
      knowledgeBaseType: existingAgent?.knowledgeBaseType ? existingAgent.knowledgeBaseType as any : 'none',
      knowledgeBaseUrl: existingAgent?.knowledgeBase && existingAgent.knowledgeBaseType === 'url' 
        ? existingAgent.knowledgeBase[0] 
        : '',
      knowledgeBaseText: existingAgent?.knowledgeBase && existingAgent.knowledgeBaseType === 'text' 
        ? existingAgent.knowledgeBase[0] 
        : '',
    },
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check file types (only allow .txt, .md, .pdf)
      const validFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ['txt', 'md', 'pdf'].includes(extension || '');
      });
      
      if (validFiles.length !== files.length) {
        toast.error('Some files were rejected. Only .txt, .md, and .pdf files are allowed.');
      }
      
      setSelectedFiles(validFiles);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare knowledge base data
      let knowledgeBase: string[] | undefined;
      
      if (values.knowledgeBaseType === 'url' && values.knowledgeBaseUrl) {
        knowledgeBase = [values.knowledgeBaseUrl];
      } else if (values.knowledgeBaseType === 'text' && values.knowledgeBaseText) {
        knowledgeBase = [values.knowledgeBaseText];
      } else if (values.knowledgeBaseType === 'file' && selectedFiles.length > 0) {
        // For demo purposes, we'll just store the file names
        // In a real app, you'd process and store the file contents or upload them to storage
        knowledgeBase = selectedFiles.map(file => file.name);
      }
      
      // Create or update agent
      if (mode === 'create') {
        await createAgent({
          name: values.name,
          systemPrompt: values.systemPrompt,
          gender: values.gender,
          knowledgeBase,
          knowledgeBaseType: values.knowledgeBaseType === 'none' ? undefined : values.knowledgeBaseType,
        });
        
        toast.success('Agent created successfully');
        navigate('/agents');
      } else if (existingAgent) {
        await updateAgent({
          ...existingAgent,
          name: values.name,
          systemPrompt: values.systemPrompt,
          gender: values.gender,
          knowledgeBase,
          knowledgeBaseType: values.knowledgeBaseType === 'none' ? undefined : values.knowledgeBaseType,
        });
        
        toast.success('Agent updated successfully');
        navigate('/agents');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const knowledgeBaseType = form.watch('knowledgeBaseType');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Voice Assistant" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your voice agent that users will see.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="You are a helpful voice assistant..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Instructions that define your agent's personality, knowledge, and behavior.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Male
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="neutral" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Neutral
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Select the gender of your agent's voice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  Knowledge Base
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Add external knowledge to your agent
                    </TooltipContent>
                  </Tooltip>
                </h3>
                
                <FormField
                  control={form.control}
                  name="knowledgeBaseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Knowledge Source</FormLabel>
                      <FormControl>
                        <Tabs 
                          onValueChange={field.onChange} 
                          value={field.value}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-4 mb-2">
                            <TabsTrigger value="none" className="text-xs md:text-sm">
                              None
                            </TabsTrigger>
                            <TabsTrigger value="url" className="text-xs md:text-sm flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span className="hidden md:inline">URL</span>
                            </TabsTrigger>
                            <TabsTrigger value="file" className="text-xs md:text-sm flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              <span className="hidden md:inline">Files</span>
                            </TabsTrigger>
                            <TabsTrigger value="text" className="text-xs md:text-sm flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="hidden md:inline">Text</span>
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="none" className="mt-0">
                            <div className="p-4 border rounded-md bg-muted/30 text-sm text-muted-foreground">
                              No external knowledge base. The agent will use its built-in knowledge only.
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="url" className="mt-0">
                            <FormField
                              control={form.control}
                              name="knowledgeBaseUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website URL</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="https://example.com/docs" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Your agent will learn from the content of this website.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                          
                          <TabsContent value="file" className="mt-0">
                            <div className="space-y-4">
                              <div className="flex items-center justify-center w-full">
                                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PDF, MD, TXT (Max 10MB per file)
                                    </p>
                                  </div>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.md,.txt"
                                    onChange={handleFileChange}
                                  />
                                </label>
                              </div>
                              {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Selected Files:</p>
                                  <ul className="space-y-1">
                                    {selectedFiles.map((file, index) => (
                                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                                        <FileQuestion className="h-4 w-4 mr-2" />
                                        {file.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="text" className="mt-0">
                            <FormField
                              control={form.control}
                              name="knowledgeBaseText"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Custom Knowledge</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Paste your knowledge base content here..." 
                                      className="min-h-[200px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Paste text content that your agent should know.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/agents')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Agent' : 'Update Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgentForm;
