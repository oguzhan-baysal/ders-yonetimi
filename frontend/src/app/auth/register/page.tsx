'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';
import authService from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'student' as 'student' | 'admin',
    firstName: '',
    lastName: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Şifreler eşleşmiyor';
    }

    if (formData.role === 'student') {
      if (!formData.firstName) {
        newErrors.firstName = 'Ad gereklidir';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Soyad gereklidir';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Form doğrulama
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // API çağrısı
      const { passwordConfirm, ...registerData } = formData;
      await authService.register(registerData);

      // Başarılı kayıt sonrası yönlendirme
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setErrors({
        submit: error.response?.data?.message || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yeni hesap oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Giriş yapın
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Kullanıcı Adı"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                autoComplete="username"
                required
              />

              <Input
                label="E-posta adresi"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                required
              />

              <Input
                label="Şifre"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
                required
              />

              <Input
                label="Şifre Tekrarı"
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={errors.passwordConfirm}
                autoComplete="new-password"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hesap Türü
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="student">Öğrenci</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <>
                  <Input
                    label="Ad"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                  />

                  <Input
                    label="Soyad"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                  />

                  <Input
                    label="Doğum Tarihi"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    error={errors.birthDate}
                  />
                </>
              )}

              {errors.submit && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Kayıt Ol
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 