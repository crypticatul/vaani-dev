
import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <AuthForm />
      
      <p className="text-sm text-muted-foreground mt-8 text-center max-w-md">
        Vaani.dev is powered by cutting-edge AI from Cognitiev.com and is a brand of Kritrima AI Technologies Private Limited.
      </p>
    </div>
  );
};

export default Login;
