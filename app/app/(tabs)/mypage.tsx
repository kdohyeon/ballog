import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTeamStore, Team } from '../../store/useTeamStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowLeftRight, Settings, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import TeamGrid from '../../components/TeamGrid';
import { supabase } from '../../lib/supabase';

export default function MyPage() {
    const { myTeam, setTeam } = useTeamStore();
    const { nickname } = useAuthStore();
    const [isFAModalVisible, setIsFAModalVisible] = useState(false);

    const handleTransferTeam = async (newTeam: Team) => {
        // 1. Update local state
        setTeam(newTeam);
        setIsFAModalVisible(false);

        // 2. Update preferred_team_id in DB
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('members')
                    .update({ preferred_team_id: newTeam.id })
                    .eq('uid', user.id);
            }
        } catch (e) {
            console.error('Error updating preferred team:', e);
        }

        Alert.alert(
            'Transfer Complete!',
            `You are now an official fan of ${newTeam.name}.`,
            [{ text: 'OK' }]
        );
    };

    if (!myTeam) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text>No team selected</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 p-6">
                <Text className="text-3xl font-quicksand-bold text-gray-900 mb-6">My Page</Text>

                {/* Profile Card */}
                <View className="bg-white rounded-3xl p-6 shadow-sm flex-row items-center mb-8">
                    <View
                        className="w-20 h-20 rounded-full items-center justify-center mr-6 shadow-inner"
                        style={{ backgroundColor: myTeam.colors.primary }}
                    >
                        <Text className="text-white font-bold text-3xl">
                            {myTeam.name.substring(0, 1)}
                        </Text>
                    </View>
                    <View>
                        {/* Nickname */}
                        <Text className="text-2xl font-quicksand-bold text-gray-900 mb-1">
                            {nickname || '볼로거'}
                        </Text>
                        <View className="flex-row items-center mb-1">
                            <Text className="text-sm font-quicksand-medium text-gray-500 mr-2">
                                Current Affiliation
                            </Text>
                            <View className="bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                <Text className="text-[10px] font-quicksand-bold text-ballog-orange">Official Fan</Text>
                            </View>
                        </View>
                        <Text className="text-lg font-quicksand-bold text-gray-700 mb-1">
                            {myTeam.name}
                        </Text>
                        <Text className="text-xs text-gray-400 font-quicksand-regular">
                            Signed since 2026.04
                        </Text>
                    </View>
                </View>

                {/* Menu List */}
                <View className="gap-y-4">
                    <TouchableOpacity
                        onPress={() => setIsFAModalVisible(true)}
                        className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm active:bg-gray-50 border border-gray-100"
                    >
                        <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
                            <ArrowLeftRight size={20} color="#FF7E67" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-quicksand-bold text-gray-900">
                                FA Market
                            </Text>
                            <Text className="text-sm font-quicksand-medium text-gray-500">
                                Transfer to another team
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm active:bg-gray-50 border border-gray-100">
                        <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4">
                            <Settings size={20} color="#4B5563" />
                        </View>
                        <Text className="text-lg font-quicksand-medium text-gray-900">
                            App Settings
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm active:bg-red-50 border border-gray-100">
                        <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
                            <LogOut size={20} color="#EF4444" />
                        </View>
                        <Text className="text-lg font-quicksand-medium text-red-500">
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* FA Market Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isFAModalVisible}
                onRequestClose={() => setIsFAModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl h-[85%]">
                        <View className="p-6 pb-2 items-center">
                            <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />
                            <Text className="text-2xl font-quicksand-bold text-gray-900 mb-2">
                                2026 FA Market
                            </Text>
                            <Text className="text-base font-quicksand-medium text-gray-500 text-center">
                                Which team do you want to transfer to?
                            </Text>
                            <Text className="text-xs text-gray-400 mt-1 mb-6">
                                (Warning: Existing loyalty points may be reset)
                            </Text>
                        </View>

                        <View className="flex-1 px-6">
                            <TeamGrid
                                onSelect={handleTransferTeam}
                                selectedTeamId={myTeam.id}
                            />
                        </View>

                        <View className="p-6 pt-2 pb-8 border-t border-gray-100">
                            <TouchableOpacity
                                onPress={() => setIsFAModalVisible(false)}
                                className="w-full py-4 rounded-2xl bg-gray-100 items-center active:bg-gray-200"
                            >
                                <Text className="font-quicksand-bold text-gray-600 text-lg">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
