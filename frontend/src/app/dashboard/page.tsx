'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  role: string;
  displayName?: string;
  studentInfo?: {
    firstName: string;
    lastName: string;
    birthDate: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, token } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!isAuthenticated || !authUser || !token) {
          router.replace('/auth/login');
          return;
        }

        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error('Oturum süresi dolmuş');
        }

        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        } else {
          toast.error('Kullanıcı bilgileri alınamadı');
        }
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchUserInfo();
    }
  }, [authUser, isAuthenticated, router, token]);

  // Loading durumunda sadece loading spinner göster
  if (isLoading || !userInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const displayName = userInfo.displayName || userInfo.studentInfo?.firstName || userInfo.email.split('@')[0];

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Hoş Geldiniz, {displayName}!
              </h1>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Hesap Bilgileri</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userInfo.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Rol</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userInfo.role === 'admin' ? 'Yönetici' : 'Öğrenci'}
                    </dd>
                  </div>
                  {userInfo.role === 'student' && userInfo.studentInfo && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Ad Soyad</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userInfo.studentInfo.firstName} {userInfo.studentInfo.lastName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Doğum Tarihi</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(userInfo.studentInfo.birthDate).toLocaleDateString('tr-TR')}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>

              {userInfo.role === 'student' ? (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Kayıtlı Dersler</h2>
                  <p className="text-sm text-gray-500">Henüz kayıtlı ders bulunmuyor.</p>
                </div>
              ) : (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Yönetim Paneli</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <button
                      onClick={() => router.push('/students')}
                      className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <h3 className="text-indigo-700 font-medium">Öğrenci Yönetimi</h3>
                      <p className="text-sm text-indigo-600 mt-1">
                        Öğrenci listesi ve kayıt işlemleri
                      </p>
                    </button>
                    <button
                      onClick={() => router.push('/courses')}
                      className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <h3 className="text-indigo-700 font-medium">Ders Yönetimi</h3>
                      <p className="text-sm text-indigo-600 mt-1">
                        Ders listesi ve ders işlemleri
                      </p>
                    </button>
                    <button
                      onClick={() => router.push('/enrollments')}
                      className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <h3 className="text-indigo-700 font-medium">Kayıt Yönetimi</h3>
                      <p className="text-sm text-indigo-600 mt-1">
                        Ders kayıt işlemleri
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 