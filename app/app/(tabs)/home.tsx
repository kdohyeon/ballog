import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import { useTeamStore } from '../../store/useTeamStore';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
    const myTeam = useTeamStore((state) => state.myTeam);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <View className="flex-row items-center gap-2">
                    {myTeam ? (
                        <View
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: myTeam.colors.primary }}
                        >
                            <Text className="text-white text-xs font-bold">
                                {myTeam.name.substring(0, 1)}
                            </Text>
                        </View>
                    ) : (
                        <View className="w-8 h-8 rounded-full bg-gray-200" />
                    )}
                    <Text className="text-xl font-quicksand-bold text-gray-900">
                        {myTeam?.name || 'Ballog'}
                    </Text>
                </View>
                <TouchableOpacity>
                    <Bell color="#1F2937" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Hero Card */}
                <View className="mx-4 mt-4 bg-ballog-orange rounded-3xl p-6 relative overflow-hidden">
                    {/* Mascot Placeholder */}
                    <View className="absolute right-[-20] bottom-[-20] w-40 h-40 bg-white/20 rounded-full" />

                    <View className="py-4">
                        <View className="w-16 h-16 bg-white/30 rounded-full mb-4 items-center justify-center">
                            {/* Fallback Mascot Icon */}
                            <Text className="text-3xl">🐻</Text>
                        </View>
                        <Text className="text-white text-2xl font-quicksand-bold leading-tight mb-6">
                            배고파요...{'\n'}직관 기록을 주세요!
                        </Text>

                        <TouchableOpacity className="bg-white px-6 py-3 rounded-full self-start shadow-sm active:bg-gray-100">
                            <Text className="text-ballog-orange font-quicksand-bold">
                                직관 기록하기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Placeholder */}
                <View className="px-6 py-8">
                    <Text className="text-gray-400 font-quicksand text-center">
                        최근 기록이 없습니다.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
