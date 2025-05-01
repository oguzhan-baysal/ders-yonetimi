'use client';

import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        {/* Hero section */}
        <div className="relative z-10 mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Ders Yönetim Sistemi
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Öğrenci ve ders yönetimini kolaylaştıran modern bir platform. 
              Derslerinizi planlayın, öğrencilerinizi yönetin ve eğitim süreçlerinizi optimize edin.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Hemen Başla
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Daha Fazla Bilgi <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 mt-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Daha Hızlı Yönetim</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Her şey kontrolünüz altında
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Modern arayüzü ve kullanıcı dostu özellikleriyle ders yönetimini kolaylaştırır.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: 'Öğrenci Yönetimi',
                  description: 'Öğrenci kayıtlarını kolayca yönetin, performans takibi yapın ve raporlar oluşturun.',
                  icon: '👥',
                },
                {
                  title: 'Ders Planlaması',
                  description: 'Dersleri planlayın, müfredatı takip edin ve ders programını optimize edin.',
                  icon: '📚',
                },
                {
                  title: 'Kayıt Yönetimi',
                  description: 'Öğrenci kayıtlarını yönetin, ders atamalarını yapın ve devam durumunu takip edin.',
                  icon: '✅',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="text-2xl mb-2">{feature.icon}</dt>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {feature.title}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </Layout>
  );
} 