'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import notFoundImage from '@/assets/404.png';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
    const router = useRouter();

    return (
        <section className="bg-green-50 dark:bg-gray-900">
            <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
                <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                    <div className="relative w-64 h-64 mb-6">
                        <Image src={notFoundImage} alt="404 Not Found" fill className="object-contain" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-2xl font-semibold text-gray-800 dark:text-green-400 md:text-3xl">
                            Oops! Wrong Path
                        </h4>
                    </div>

                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        This path doesn&apos;t exist. Let&apos;s get you back on track!
                    </p>

                    <div className="flex flex-col w-full mt-8 gap-4 sm:flex-row sm:w-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="w-5 h-5 text-green-500" />
                            <span>Go Back</span>
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                            <Home className="w-5 h-5" />
                            <span>Take Me Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
