'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';
import koKR from 'antd/locale/ko_KR';

export default function AntdConfigProvider({ children }: { children: ReactNode }) {
    return (
        <ConfigProvider locale={koKR}>
            {children}
        </ConfigProvider>
    );
}
