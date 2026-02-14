import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as ImagePicker from 'expo-image-picker';
import { CalendarGame } from '../hooks/useCalendarData';
import { useTeamStore } from '../store/useTeamStore';

interface RecordModalProps {
    visible: boolean;
    onClose: () => void;
    game: CalendarGame;
    initialData?: {
        id: string;
        seatInfo: string | null;
        content: string | null;
        ticketImageUrl: string | null;
        supportedTeamId: string | null;
    };
    onSave: (data: {
        gameId: string;
        recordId?: string;
        seat: string;
        review: string;
        imageUri: string | null;
        supportedTeamId: string | null;
    }) => void;
}

type GameResult = 'WIN' | 'LOSE' | 'DRAW' | null;

function computeResult(
    game: CalendarGame,
    supportedTeamId: string | undefined | null
): GameResult {
    if (!supportedTeamId) return null;
    if (game.home_score === null || game.away_score === null) return null;

    const isHome = supportedTeamId === game.home_team_id;
    const isAway = supportedTeamId === game.away_team_id;

    if (!isHome && !isAway) return null;

    if (game.home_score === game.away_score) return 'DRAW';

    if (isHome) {
        return game.home_score > game.away_score ? 'WIN' : 'LOSE';
    } else {
        return game.away_score > game.home_score ? 'WIN' : 'LOSE';
    }
}

export default function RecordModal({
    visible,
    onClose,
    game,
    initialData,
    onSave,
}: RecordModalProps) {
    const { myTeam } = useTeamStore();
    const isEdit = !!initialData;
    const [seat, setSeat] = useState('');
    const [review, setReview] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    // Initialize state from initialData when modal becomes visible
    React.useEffect(() => {
        if (visible && initialData) {
            setSeat(initialData.seatInfo || '');
            setReview(initialData.content || '');
            setImageUri(initialData.ticketImageUrl || null);
            setSelectedTeamId(initialData.supportedTeamId || null);
        } else if (visible && !isEdit) {
            setSeat('');
            setReview('');
            setImageUri(null);
            setSelectedTeamId(null);
        }
    }, [visible, initialData, isEdit]);

    // Check if myTeam is playing in this game
    const myTeamName = myTeam?.name?.toLowerCase();
    const isMyTeamHome = !!myTeamName && !!game.home_team?.name?.toLowerCase().includes(myTeamName);
    const isMyTeamAway = !!myTeamName && !!game.away_team?.name?.toLowerCase().includes(myTeamName);
    const isMyTeamPlaying = isMyTeamHome || isMyTeamAway;

    // Determine effective supported team ID
    const effectiveSupportedTeamId = useMemo(() => {
        if (isMyTeamPlaying) {
            return isMyTeamHome ? game.home_team_id : game.away_team_id;
        }
        return selectedTeamId;
    }, [isMyTeamPlaying, isMyTeamHome, game.home_team_id, game.away_team_id, selectedTeamId]);

    const result = computeResult(game, effectiveSupportedTeamId);
    const gameDate = new Date(game.game_date_time);

    const handlePickImage = async () => {
        const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permResult.granted) return;

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!pickerResult.canceled && pickerResult.assets[0]) {
            setImageUri(pickerResult.assets[0].uri);
        }
    };

    const handleSave = () => {
        onSave({
            gameId: game.id,
            recordId: initialData?.id,
            seat: seat.trim(),
            review: review.trim(),
            imageUri,
            supportedTeamId: effectiveSupportedTeamId,
        });
        onClose();
    };

    const handleClose = () => {
        onClose();
    };


    const primaryColor = myTeam?.colors.primary || '#FF7E67';

    const resultColor =
        result === 'WIN'
            ? primaryColor
            : result === 'LOSE'
                ? '#9CA3AF'
                : '#6B7280';
    const resultBg =
        result === 'WIN'
            ? `${primaryColor}10`
            : result === 'LOSE'
                ? '#F3F4F6'
                : '#F9FAFB';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 bg-white">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
                        <Text className="text-lg font-quicksand-bold text-black">
                            Game Record
                        </Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
                        >
                            <X size={18} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                    >
                        {/* ── Section 1: Match Summary Card ── */}
                        <View className="mx-4 mt-2 rounded-2xl overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
                            {/* Date & Stadium */}
                            <View className="items-center pt-4 pb-2">
                                <Text className="text-xs font-quicksand-medium" style={{ color: '#6B7280' }}>
                                    {format(gameDate, 'MM.dd (EEE)', { locale: ko })}
                                </Text>
                            </View>

                            {/* Scoreboard */}
                            <View className="flex-row items-center justify-center px-4 pb-4 pt-1">
                                {/* Away Team */}
                                <View className="items-center flex-1">
                                    <View
                                        className="w-14 h-14 rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: '#E5E7EB' }}
                                    >
                                        <Text className="font-quicksand-bold text-sm" style={{ color: '#374151' }}>
                                            {game.away_team?.name?.substring(0, 2)}
                                        </Text>
                                    </View>
                                    <Text className="font-quicksand-bold text-sm text-gray-700">
                                        {game.away_team?.name}
                                    </Text>
                                </View>

                                {/* Score Center */}
                                <View className="items-center mx-3">
                                    {game.home_score !== null && game.away_score !== null ? (
                                        <>
                                            <Text
                                                className="font-quicksand-bold"
                                                style={{
                                                    fontSize: 36,
                                                    lineHeight: 42,
                                                    color: result === 'WIN' ? primaryColor : '#1F2937',
                                                    letterSpacing: 4,
                                                }}
                                            >
                                                {game.away_score} : {game.home_score}
                                            </Text>
                                            {result && (
                                                <View
                                                    className="mt-2 px-4 py-1 rounded-full"
                                                    style={{ backgroundColor: resultBg }}
                                                >
                                                    <Text
                                                        className="font-quicksand-bold text-xs"
                                                        style={{ color: resultColor }}
                                                    >
                                                        {result}
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <Text className="text-2xl font-quicksand-bold text-gray-300">
                                            VS
                                        </Text>
                                    )}
                                </View>

                                {/* Home Team */}
                                <View className="items-center flex-1">
                                    <View
                                        className="w-14 h-14 rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: '#E5E7EB' }}
                                    >
                                        <Text className="font-quicksand-bold text-sm" style={{ color: '#374151' }}>
                                            {game.home_team?.name?.substring(0, 2)}
                                        </Text>
                                    </View>
                                    <Text className="font-quicksand-bold text-sm text-gray-700">
                                        {game.home_team?.name}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Team Selector (only when myTeam is NOT playing) ── */}
                        {!isMyTeamPlaying && (
                            <View className="mx-4 mt-4">
                                <Text className="text-sm font-quicksand-bold text-gray-700 mb-3">
                                    응원한 팀을 선택해주세요
                                </Text>
                                <View className="flex-row gap-3">
                                    {/* Away team option */}
                                    <TouchableOpacity
                                        onPress={() => setSelectedTeamId(game.away_team_id)}
                                        className="flex-1 py-3 rounded-xl items-center"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: selectedTeamId === game.away_team_id ? primaryColor : '#E5E7EB',
                                            backgroundColor: selectedTeamId === game.away_team_id ? `${primaryColor}10` : '#FFFFFF',
                                        }}
                                    >
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center mb-1"
                                            style={{ backgroundColor: selectedTeamId === game.away_team_id ? primaryColor : '#E5E7EB' }}
                                        >
                                            <Text
                                                className="font-quicksand-bold text-xs"
                                                style={{ color: selectedTeamId === game.away_team_id ? '#FFFFFF' : '#374151' }}
                                            >
                                                {game.away_team?.name?.substring(0, 2)}
                                            </Text>
                                        </View>
                                        <Text
                                            className="font-quicksand-bold text-sm"
                                            style={{ color: selectedTeamId === game.away_team_id ? primaryColor : '#6B7280' }}
                                        >
                                            {game.away_team?.name}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Home team option */}
                                    <TouchableOpacity
                                        onPress={() => setSelectedTeamId(game.home_team_id)}
                                        className="flex-1 py-3 rounded-xl items-center"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: selectedTeamId === game.home_team_id ? primaryColor : '#E5E7EB',
                                            backgroundColor: selectedTeamId === game.home_team_id ? `${primaryColor}10` : '#FFFFFF',
                                        }}
                                    >
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center mb-1"
                                            style={{ backgroundColor: selectedTeamId === game.home_team_id ? primaryColor : '#E5E7EB' }}
                                        >
                                            <Text
                                                className="font-quicksand-bold text-xs"
                                                style={{ color: selectedTeamId === game.home_team_id ? '#FFFFFF' : '#374151' }}
                                            >
                                                {game.home_team?.name?.substring(0, 2)}
                                            </Text>
                                        </View>
                                        <Text
                                            className="font-quicksand-bold text-sm"
                                            style={{ color: selectedTeamId === game.home_team_id ? primaryColor : '#6B7280' }}
                                        >
                                            {game.home_team?.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* ── Section 2: Input Fields ── */}
                        <View className="mx-4 mt-6">
                            {/* Seat Info */}
                            <View className="mb-5">
                                <Text className="text-sm font-quicksand-bold text-gray-700 mb-2">
                                    좌석 (Optional)
                                </Text>
                                <TextInput
                                    value={seat}
                                    onChangeText={setSeat}
                                    placeholder="e.g., 1루 레드존 102블럭"
                                    placeholderTextColor="#D1D5DB"
                                    className="font-quicksand-medium text-sm text-black"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#E5E7EB',
                                        paddingVertical: 10,
                                    }}
                                />
                            </View>

                            {/* Review */}
                            <View className="mb-5">
                                <Text className="text-sm font-quicksand-bold text-gray-700 mb-2">
                                    한 줄 리뷰 (Optional)
                                </Text>
                                <TextInput
                                    value={review}
                                    onChangeText={setReview}
                                    placeholder="오늘 직관 분위기는 어땠나요?"
                                    placeholderTextColor="#D1D5DB"
                                    multiline
                                    numberOfLines={3}
                                    className="font-quicksand-medium text-sm text-black"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        borderRadius: 12,
                                        padding: 12,
                                        minHeight: 80,
                                        textAlignVertical: 'top',
                                    }}
                                />
                            </View>

                            {/* Photo Upload */}
                            <View className="mb-2">
                                <Text className="text-sm font-quicksand-bold text-gray-700 mb-2">
                                    사진 (Optional)
                                </Text>
                                {imageUri ? (
                                    <View className="relative">
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={{
                                                width: '100%',
                                                height: 200,
                                                borderRadius: 12,
                                            }}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setImageUri(null)}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full items-center justify-center"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                        >
                                            <X size={14} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handlePickImage}
                                        className="flex-row items-center justify-center py-4 rounded-xl"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#E5E7EB',
                                            borderStyle: 'dashed',
                                        }}
                                    >
                                        <Camera size={20} color="#9CA3AF" />
                                        <Text className="ml-2 font-quicksand-medium text-sm" style={{ color: '#9CA3AF' }}>
                                            사진 추가하기
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </ScrollView>

                    {/* ── Section 3: Footer ── */}
                    <View className="px-4 pb-8 pt-3" style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="py-4 rounded-2xl items-center"
                            style={{ backgroundColor: primaryColor }}
                            activeOpacity={0.85}
                        >
                            <Text className="text-white font-quicksand-bold text-base">
                                {isEdit ? '수정 완료' : '기록 저장하기'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
