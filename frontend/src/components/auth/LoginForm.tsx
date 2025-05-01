'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Geçerli bir email adresi giriniz')
    .required('Email adresi zorunludur'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre zorunludur'),
});

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        // API çağrısı burada yapılacak
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Giriş başarısız');
        }

        // Başarılı giriş
        login(data.user, data.token);
        toast.success('Başarıyla giriş yapıldı');
        router.push('/dashboard');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.password}</div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </Button>
    </form>
  );
};

export default LoginForm; 