'use client';

import React, { useState } from 'react';
import { Card, DatePicker, Button, Table, Tag, Space, message, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crawlSchedule, fetchMonthlyGames } from '@/lib/api';
import { Game, GameStatus } from '@/types';

const { RangePicker } = DatePicker;

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [crawlRange, setCrawlRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [viewMonth, setViewMonth] = useState<Dayjs>(dayjs());

    // Mutation for Crawling
    const crawlMutation = useMutation({
        mutationFn: async () => {
            if (!crawlRange) throw new Error('기간을 선택해주세요');
            const [start, end] = crawlRange;
            return crawlSchedule(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        },
        onSuccess: () => {
            message.success('크롤링 작업이 시작되었습니다.');
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
        onError: (error) => {
            message.error(`크롤링 실패: ${error.message}`);
        },
    });

    // Query for fetching monthly games
    const { data: games, isLoading } = useQuery({
        queryKey: ['games', viewMonth.year(), viewMonth.month() + 1],
        queryFn: () => fetchMonthlyGames(viewMonth.year(), viewMonth.month() + 1),
    });

    // Table Columns
    const columns = [
        {
            title: '일시',
            dataIndex: 'gameDateTime',
            key: 'gameDateTime',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
            sorter: (a: Game, b: Game) => dayjs(a.gameDateTime).unix() - dayjs(b.gameDateTime).unix(),
        },
        {
            title: '홈팀',
            dataIndex: ['homeTeam', 'name'],
            key: 'homeTeam',
        },
        {
            title: '원정팀',
            dataIndex: ['awayTeam', 'name'],
            key: 'awayTeam',
        },
        {
            title: '스코어',
            key: 'score',
            render: (_: any, record: Game) => (
                <span className="font-bold">
                    {record.homeScore} : {record.awayScore}
                </span>
            ),
            align: 'center' as const,
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            render: (status: GameStatus) => {
                let color = 'default';
                if (status === GameStatus.IN_PROGRESS) color = 'processing';
                if (status === GameStatus.FINISHED) color = 'success';
                if (status === GameStatus.CANCELED) color = 'error';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: '구장',
            dataIndex: ['stadium', 'name'],
            key: 'stadium',
            render: (stadium: any) => stadium ? stadium : '-',
        },
    ];

    const handleCrawl = () => {
        if (!crawlRange) {
            message.warning('크롤링할 기간을 선택해주세요.');
            return;
        }
        crawlMutation.mutate();
    };

    return (
        <div className="space-y-6">
            {/* Controls Section */}
            <Card title="경기 데이터 관리" className="shadow-sm">
                <Row gutter={24} align="middle">
                    <Col span={12}>
                        <Space direction="vertical">
                            <span className="text-gray-500 text-sm">데이터 수집 (Naver Sports)</span>
                            <Space>
                                <RangePicker
                                    value={crawlRange}
                                    onChange={(dates) => setCrawlRange(dates as [Dayjs, Dayjs])}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleCrawl}
                                    loading={crawlMutation.isPending}
                                    icon={<ReloadOutlined />}
                                >
                                    크롤링 실행
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                    <Col span={12} className="text-right">
                        {/* Visual balance */}
                    </Col>
                </Row>
            </Card>

            {/* Data View Section */}
            <Card
                title={
                    <Space>
                        <span>경기 목록 조회</span>
                        <DatePicker
                            picker="month"
                            value={viewMonth}
                            onChange={(date) => date && setViewMonth(date)}
                            allowClear={false}
                        />
                    </Space>
                }
                className="shadow-sm"
            >
                <Table
                    dataSource={games}
                    columns={columns}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>
        </div>
    );
}
