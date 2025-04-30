'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('E-posta adresi gereklidir');
      setIsLoading(false);
      return;
    }

    try {
      // API çağrısı burada yapılacak
      console.log('Şifre sıfırlama e-postası gönderiliyor:', email);
      
      // Başarılı gönderim sonrası
      setSuccess(true);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      setError('Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  E-posta Gönderildi
                </h2>
                <p className="text-gray-600 mb-6">
                  Şifre sıfırlama talimatları e-posta adresinize gönderildi.
                  Lütfen gelen kutunuzu kontrol edin.
                </p>
                <Link
                  href="/auth/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Şifrenizi mi unuttunuz?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="E-posta adresi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                autoComplete="email"
                required
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Şifre Sıfırlama Bağlantısı Gönder
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 