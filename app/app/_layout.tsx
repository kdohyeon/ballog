import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Quicksand_400Regular, Quicksand_500Medium, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Quicksand_400Regular,
        Quicksand_500Medium,
        Quicksand_700Bold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
        </Stack>
    );
}
