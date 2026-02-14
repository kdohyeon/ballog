import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

interface AuthState {
    memberId: string | null;
    uid: string | null;
    nickname: string | null;
    fetchMember: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            memberId: null,
            uid: null,
            nickname: null,
            fetchMember: async () => {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    const uid = user.id;

                    const { data: member, error } = await supabase
                        .from('members')
                        .select('id, uid, nickname')
                        .eq('uid', uid)
                        .single();

                    if (error) {
                        console.error('Error fetching member:', error);
                        return;
                    }

                    if (member) {
                        set({
                            memberId: member.id,
                            uid: member.uid,
                            nickname: member.nickname,
                        });
                    }
                } catch (e) {
                    console.error('Error in fetchMember:', e);
                }
            },
        }),
        {
            name: 'ballog-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
