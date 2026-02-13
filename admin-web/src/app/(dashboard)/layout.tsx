'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DatabaseOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const { token } = theme.useToken();
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuth();

    // Mapping current path to selected keys
    const getSelectedKey = () => {
        if (pathname === '/' || pathname === '') return ['1'];
        return ['1'];
    };

    const userMenu = {
        items: [
            {
                key: 'logout',
                label: '로그아웃',
                icon: <LogoutOutlined />,
                onClick: logout,
            },
        ],
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-md border-r border-gray-100">
                <div className="flex items-center justify-center h-16 border-b border-gray-100">
                    {/* Logo or Brand */}
                    <span className={`font-bold text-lg transition-opacity duration-200 ${collapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                        Ballog Admin
                    </span>
                    {collapsed && <span className="font-bold text-lg">B</span>}
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={getSelectedKey()}
                    items={[
                        {
                            key: '1',
                            icon: <DatabaseOutlined />,
                            label: <Link href="/">경기 데이터 관리</Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: token.colorBgContainer }} className="flex justify-between items-center px-4 shadow-sm">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <div className="mr-6 flex items-center">
                        <Dropdown menu={userMenu} placement="bottomRight" arrow>
                            <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-md transition-colors">
                                <Avatar icon={<UserOutlined />} className="mr-2" style={{ backgroundColor: '#1890ff' }} />
                                <Text strong>{user || 'Admin'}</Text>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        overflowY: 'auto'
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
