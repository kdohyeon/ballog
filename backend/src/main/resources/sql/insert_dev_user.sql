-- 임시 사용자 "개발자 볼록이" 추가
-- uid: 31aef94b-bdec-45bc-bad9-51184dceb337

INSERT INTO members (id, uid, nickname, created_at, updated_at)
VALUES (gen_random_uuid(), '31aef94b-bdec-45bc-bad9-51184dceb337', '개발자 볼록이', NOW(), NOW())
ON CONFLICT (uid) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    updated_at = NOW();
