import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAppleLogin = () => {
        Alert.alert('Coming Soon', 'Apple 로그인은 곧 지원될 예정입니다.');
    };

    const handleKakaoLogin = () => {
        Alert.alert('Coming Soon', '카카오 로그인은 곧 지원될 예정입니다.');
    };

    const handleDevLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: 'test@ballog.com',
                password: 'test1234',
            });

            if (error) {
                Alert.alert('로그인 실패', error.message);
                return;
            }

            router.replace('/(auth)/onboarding');
        } catch (e: any) {
            Alert.alert('오류', e.message || '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-between px-6 py-8">
                {/* ── Branding Section ── */}
                <View className="flex-1 items-center justify-center">
                    {/* Logo */}
                    <Text className="text-4xl font-quicksand-bold text-ballog-orange mb-6">
                        Ballog
                    </Text>

                    {/* Mascot Placeholder */}
                    <View className="w-48 h-48 rounded-full bg-orange-50 items-center justify-center mb-6 border-2 border-ballog-orange/20">
                        <Text className="text-7xl">⚾</Text>
                    </View>

                    {/* Tagline */}
                    <Text className="text-lg text-gray-600 font-quicksand-medium text-center">
                        야구 직관 기록, 볼로그와 함께!
                    </Text>
                </View>

                {/* ── Login Buttons Section ── */}
                <View className="gap-3 mb-4">
                    {/* Apple Login */}
                    <TouchableOpacity
                        onPress={handleAppleLogin}
                        className="flex-row items-center justify-center bg-black rounded-xl py-4 px-6"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-base font-quicksand-bold">
                            Apple로 계속하기
                        </Text>
                    </TouchableOpacity>

                    {/* Kakao Login */}
                    <TouchableOpacity
                        onPress={handleKakaoLogin}
                        className="flex-row items-center justify-center rounded-xl py-4 px-6"
                        style={{ backgroundColor: '#FEE500' }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-black text-base font-quicksand-bold">
                            💬 카카오로 계속하기
                        </Text>
                    </TouchableOpacity>

                    {/* ⚡ Developer Bypass */}
                    <TouchableOpacity
                        onPress={handleDevLogin}
                        disabled={loading}
                        className="flex-row items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-4 px-6 mt-2"
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#9CA3AF" />
                        ) : (
                            <Text className="text-gray-400 text-sm font-quicksand-medium">
                                ⚡ DEV: 바로 시작하기 (개발용)
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
