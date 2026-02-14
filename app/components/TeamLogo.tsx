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
        'HT': require('../assets/images/teams/ballog_mascot_HT.png'), // KIA
        'SS': require('../assets/images/teams/ballog_mascot_SS.png'), // 삼성
        'LG': require('../assets/images/teams/ballog_mascot_LG.png'), // LG
        'OB': require('../assets/images/teams/ballog_mascot_OB.png'), // 두산
        'KT': require('../assets/images/teams/ballog_mascot_KT.png'), // KT
        'SSG': require('../assets/images/teams/ballog_mascot_SSG.png'), // SSG
        'LT': require('../assets/images/teams/ballog_mascot_LT.png'), // 롯데
        'HH': require('../assets/images/teams/ballog_mascot_HH.png'), // 한화
        'NC': require('../assets/images/teams/ballog_mascot_NC.png'), // NC
        'WO': require('../assets/images/teams/ballog_mascot_WO.png'), // 키움
    };

    // Helper to get code from name if teamCode is missing
    const getCodeFromName = (name: string): string => {
        const n = name.toLowerCase();
        if (n.includes('kia') || n.includes('기아')) return 'HT';
        if (n.includes('삼성')) return 'SS';
        if (n.includes('lg')) return 'LG';
        if (n.includes('두산')) return 'OB';
        if (n.includes('kt')) return 'KT';
        if (n.includes('ssg')) return 'SSG';
        if (n.includes('롯데')) return 'LT';
        if (n.includes('한화')) return 'HH';
        if (n.includes('nc')) return 'NC';
        if (n.includes('키움')) return 'WO';
        return '';
    };

    const effectiveCode = (teamCode || getCodeFromName(teamName)).toUpperCase();
    const logoSource = teamLogos[effectiveCode];

    if (logoSource) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        width: size,
                        height: size,
                        backgroundColor: 'white',
                        borderRadius: size / 2,
                        borderWidth: 1,
                        borderColor: '#EEEEEE'
                    }
                ]}
            >
                <Image
                    source={logoSource}
                    style={{ width: size * 0.8, height: size * 0.8 }}
                    resizeMode="contain"
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
                    backgroundColor: primaryColor || '#F3F4F6',
                    borderRadius: size / 2
                }
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        fontSize: fontSize || (size * 0.4),
                        color: (primaryColor && primaryColor !== '#F3F4F6') ? 'white' : '#9CA3AF'
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
