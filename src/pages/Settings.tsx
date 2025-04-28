
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Form validation schema
const apiSettingsSchema = z.object({
  azureOpenAIApiKey: z.string().min(1, 'API key is required'),
  azureOpenAIEndpoint: z.string().url('Must be a valid URL'),
  azureOpenAIApiVersion: z.string().min(1, 'API version is required'),
});

type ApiSettingsValues = z.infer<typeof apiSettingsSchema>;

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with existing settings or defaults
  const form = useForm<ApiSettingsValues>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      azureOpenAIApiKey: localStorage.getItem('azure-openai-api-key') || '',
      azureOpenAIEndpoint: localStorage.getItem('azure-openai-endpoint') || '',
      azureOpenAIApiVersion: localStorage.getItem('azure-openai-api-version') || '2023-05-15',
    },
  });
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Handle form submission
  const onSubmit = async (values: ApiSettingsValues) => {
    setIsSubmitting(true);
    
    try {
      // Store settings in localStorage
      localStorage.setItem('azure-openai-api-key', values.azureOpenAIApiKey);
      localStorage.setItem('azure-openai-endpoint', values.azureOpenAIEndpoint);
      localStorage.setItem('azure-openai-api-version', values.azureOpenAIApiVersion);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If user is not logged in, don't render the content
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 neon-text">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Azure OpenAI API credentials
        </p>
      </div>
      
      <div className="max-w-2xl">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Azure OpenAI API Settings</CardTitle>
            <CardDescription>
              Enter your Azure OpenAI API credentials to use the voice agent features
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="azureOpenAIApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azure OpenAI API Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your Azure OpenAI API key"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Azure OpenAI API key will be stored securely in your browser
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="azureOpenAIEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azure OpenAI Endpoint</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://your-resource-name.openai.azure.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The endpoint URL for your Azure OpenAI service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="azureOpenAIApiVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azure OpenAI API Version</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2023-05-15"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The API version to use for Azure OpenAI requests
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
