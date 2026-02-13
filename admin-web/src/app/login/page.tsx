'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = (values: any) => {
        setLoading(true);
        // Simulate network delay for better UX
        setTimeout(() => {
            if (values.username === 'admin' && values.password === 'admin') {
                localStorage.setItem('admin_user', 'admin');
                message.success('로그인 성공');
                router.push('/');
            } else {
                message.error('아이디 또는 비밀번호가 올바르지 않습니다.');
                setLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                <div className="text-center mb-8">
                    <Title level={2}>Ballog Admin</Title>
                    <p className="text-gray-500">관리자 로그인이 필요합니다.</p>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="아이디"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="비밀번호"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
