
import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <AuthForm />
      
      <p className="text-sm text-muted-foreground mt-8 text-center max-w-md">
        VoiceAgent Weave allows you to create and deploy Azure OpenAI-powered
        voice agents directly on your website.
      </p>
    </div>
  );
};

export default Login;
