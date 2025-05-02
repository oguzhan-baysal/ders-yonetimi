'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';
import authService from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    if (isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    // Kayıt başarılı mesajını göster
    const isNewRegistration = searchParams.get('registered') === 'true';
    if (isNewRegistration) {
      toast.success('Kayıt işleminiz başarıyla tamamlandı. Lütfen giriş yapın.', {
        duration: 5000, // 5 saniye göster
        position: 'top-center'
      });
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login(formData);

      // Auth state'i güncelle
      login({
        id: response._id,
        email: response.email,
        role: response.role
      }, response.token);

      // Başarılı mesajı göster
      toast.success('Başarıyla giriş yapıldı!');

      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      toast.error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
      setErrors({
        submit: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hesabınıza giriş yapın
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Veya{' '}
          <Link
            href="/auth/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            yeni bir hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="E-posta adresi"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
              required
            />

            <Input
              label="Şifre"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Şifrenizi mi unuttunuz?
                </Link>
              </div>
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600">{errors.submit}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </Layout>
  );
} 