import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface TeamLogoProps {
    teamName: string;
    teamCode: string;
    primaryColor: string;
    size?: number;
    fontSize?: number;
}

/**
 * TeamLogo component handles rendering a team logo image if it exists,
 * or falling back to a text-based circle with the team's first letter.
 */
export default function TeamLogo({
    teamName,
    teamCode,
    primaryColor,
    size = 40,
    fontSize = 16
}: TeamLogoProps) {

    // Mapping for local images. 
    // User can add their own images to assets/images/teams and update this mapping.
    // For now, it will always fallback to text since images are missing.
    const teamLogos: { [key: string]: any } = {
        'HT': require('../assets/images/teams/ballog_mascot_HT.png'),
        'SS': require('../assets/images/teams/ballog_mascot_SS.png'),
        'LG': require('../assets/images/teams/ballog_mascot_LG.png'),
        'OB': require('../assets/images/teams/ballog_mascot_OB.png'),
        'KT': require('../assets/images/teams/ballog_mascot_KT.png'),
        'SSG': require('../assets/images/teams/ballog_mascot_SSG.png'),
        'LT': require('../assets/images/teams/ballog_mascot_LT.png'),
        'HH': require('../assets/images/teams/ballog_mascot_HH.png'),
        'NC': require('../assets/images/teams/ballog_mascot_NC.png'),
        'WO': require('../assets/images/teams/ballog_mascot_WO.png'),
    };

    const logoSource = teamLogos[teamCode];

    if (logoSource) {
        return (
            <View
                style={[
                    styles.container,
                    { width: size, height: size, backgroundColor: 'white' }
                ]}
            >
                <Image
                    source={logoSource}
                    style={{ width: size, height: size }}
                    resizeMode="cover"
                />
            </View>
        );
    }

    // Fallback to text-based circle
    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    backgroundColor: primaryColor,
                    borderRadius: size / 2
                }
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        fontSize: fontSize || (size * 0.4),
                        color: 'white'
                    }
                ]}
            >
                {teamName.substring(0, 1)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    text: {
        fontWeight: 'bold',
    }
});
