import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
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
            <View className="flex-1 justify-between px-8 py-16">
                {/* ── Branding Section ── */}
                <View className="items-center">
                    {/* Logo */}
                    <Text className="text-5xl font-quicksand-bold text-ballog-orange mb-8">
                        Ballog
                    </Text>

                    {/* Mascot Illustration (Circular Crop) */}
                    <View className="w-80 h-80 rounded-full overflow-hidden mb-6 bg-orange-50 items-center justify-center border-4 border-orange-100/50">
                        <Image
                            source={require('../assets/images/mascot/ballog_mascot_main.png')}
                            className="w-80 h-80"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Tagline */}
                    <Text className="text-xl text-gray-600 font-quicksand-medium text-center">
                        나만의 승리요정, 볼로그
                    </Text>
                </View>

                {/* ── Login Buttons Section ── */}
                <View className="w-full gap-4">
                    {/* Apple Login */}
                    <TouchableOpacity
                        onPress={handleAppleLogin}
                        className="w-full flex-row items-center justify-center bg-black rounded-2xl py-5 shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-quicksand-bold">
                            Apple로 계속하기
                        </Text>
                    </TouchableOpacity>

                    {/* Kakao Login */}
                    <TouchableOpacity
                        onPress={handleKakaoLogin}
                        className="w-full flex-row items-center justify-center rounded-2xl py-5 shadow-sm"
                        style={{ backgroundColor: '#FEE500' }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-black text-lg font-quicksand-bold">
                            💬 카카오로 계속하기
                        </Text>
                    </TouchableOpacity>

                    {/* ⚡ Developer Bypass */}
                    <TouchableOpacity
                        onPress={handleDevLogin}
                        disabled={loading}
                        className="w-full flex-row items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-4 mt-2"
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
