import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TEAMS, Team } from '../constants/teams';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamSelection'>;

export default function TeamSelectionScreen({ navigation }: Props) {
    const handleTeamSelect = (team: Team) => {
        // Navigate to Home screen after selection
        navigation.replace('Home');
    };

    const renderItem = ({ item }: { item: Team }) => (
        <TouchableOpacity
            style={[styles.teamButton, { borderColor: item.primaryColor }]}
            onPress={() => handleTeamSelect(item)}
        >
            <View style={[styles.colorIndicator, { backgroundColor: item.primaryColor }]} />
            <Text style={styles.teamName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Your Team</Text>
                <Text style={styles.subtitle}>Choose the team you root for!</Text>
            </View>
            <FlatList
                data={TEAMS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    teamButton: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    colorIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 12,
    },
    teamName: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
    },
});
