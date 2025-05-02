import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store';
import { register } from '@/features/auth/authSlice';
import { RegisterData } from '@/types';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Kullanıcı adı zorunludur')
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  email: Yup.string()
    .email('Geçerli bir email adresi giriniz')
    .required('Email adresi zorunludur'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre zorunludur'),
  role: Yup.string()
    .oneOf(['admin', 'student'] as const, 'Geçerli bir rol seçiniz')
    .required('Rol seçimi zorunludur'),
  firstName: Yup.string().when('role', {
    is: (val: string) => val === 'student',
    then: () => Yup.string().required('İsim zorunludur'),
    otherwise: () => Yup.string()
  }),
  lastName: Yup.string().when('role', {
    is: (val: string) => val === 'student',
    then: () => Yup.string().required('Soyisim zorunludur'),
    otherwise: () => Yup.string()
  }),
  birthDate: Yup.date().when('role', {
    is: (val: string) => val === 'student',
    then: () => Yup.date().required('Doğum tarihi zorunludur'),
    otherwise: () => Yup.date()
  })
});

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik<RegisterData>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'student' as const,
      firstName: '',
      lastName: '',
      birthDate: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(register(values));
    },
  });

  const isStudent = formik.values.role === 'student';

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Kullanıcı Adı
        </label>
        <input
          id="username"
          type="text"
          {...formik.getFieldProps('username')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.username && formik.errors.username && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.username}</div>
        )}
      </div>

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

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          id="role"
          {...formik.getFieldProps('role')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="student">Öğrenci</option>
          <option value="admin">Admin</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.role}</div>
        )}
      </div>

      {isStudent && (
        <>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              İsim
            </label>
            <input
              id="firstName"
              type="text"
              {...formik.getFieldProps('firstName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.firstName}</div>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Soyisim
            </label>
            <input
              id="lastName"
              type="text"
              {...formik.getFieldProps('lastName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.lastName}</div>
            )}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Doğum Tarihi
            </label>
            <input
              id="birthDate"
              type="date"
              {...formik.getFieldProps('birthDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.birthDate && formik.errors.birthDate && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.birthDate}</div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
      </button>
    </form>
  );
};

export default RegisterForm; 