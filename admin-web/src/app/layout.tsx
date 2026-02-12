import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import QueryProvider from '@/lib/QueryProvider';
import AntdConfigProvider from '@/lib/AntdConfigProvider';
import './globals.css';
import { Layout } from 'antd';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ballog Admin',
    description: 'Baseball Archive Admin Dashboard',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <QueryProvider>
                        <AntdConfigProvider>
                            <Layout style={{ minHeight: '100vh' }}>
                                {children}
                            </Layout>
                        </AntdConfigProvider>
                    </QueryProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
