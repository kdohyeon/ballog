-- KBO 팀 데이터 (Korean)
-- 기존 UUID를 유지하여 앱과의 호환성을 보장합니다.

INSERT INTO teams (id, name, short_name, code, primary_color, created_at, updated_at) VALUES 
(gen_random_uuid(), 'KIA 타이거즈', '기아', 'HT', '#EA0029', NOW(), NOW()),
(gen_random_uuid(), '삼성 라이온즈', '삼성', 'SS', '#074CA1', NOW(), NOW()),
(gen_random_uuid(), 'LG 트윈스', 'LG', 'LG', '#C30452', NOW(), NOW()),
(gen_random_uuid(), '두산 베어스', '두산', 'OB', '#131230', NOW(), NOW()),
(gen_random_uuid(), 'kt wiz', 'kt', 'KT', '#000000', NOW(), NOW()),
(gen_random_uuid(), 'SSG 랜더스', 'SSG', 'SSG', '#CE0E2D', NOW(), NOW()),
(gen_random_uuid(), '롯데 자이언츠', '롯데', 'LT', '#041E42', NOW(), NOW()),
(gen_random_uuid(), '한화 이글스', '한화', 'HH', '#F37321', NOW(), NOW()),
(gen_random_uuid(), 'NC 다이노스', 'NC', 'NC', '#315288', NOW(), NOW()),
(gen_random_uuid(), '키움 히어로즈', '키움', 'WO', '#820024', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    short_name = EXCLUDED.short_name, 
    updated_at = NOW();

-- KBO 구장 데이터 (Korean)
-- 아래 쿼리에서 값을 원하는 대로 수정하여 실행하세요.
-- ID는 자동으로 생성되도록 UUID_GENERATE_V4() 등을 사용하거나 생략할 수 있습니다 (DB 설정에 따라 다름).

INSERT INTO stadiums (id, name, weather_keyword, created_at, updated_at) VALUES 
(gen_random_uuid(), '잠실 야구장', 'JAMSIL', NOW(), NOW()),
(gen_random_uuid(), '고척 스카이돔', 'GOCHEOK', NOW(), NOW()),
(gen_random_uuid(), '수원 케이티 위즈 파크', 'SUWON', NOW(), NOW()),
(gen_random_uuid(), '인천 SSG 랜더스필드', 'INCHEON', NOW(), NOW()),
(gen_random_uuid(), '대전 한화생명 이글스파크', 'DAEJEON', NOW(), NOW()),
(gen_random_uuid(), '광주-기아 챔피언스 필드', 'GWANGJU', NOW(), NOW()),
(gen_random_uuid(), '대구 삼성 라이온즈 파크', 'DAEGU', NOW(), NOW()),
(gen_random_uuid(), '사직 야구장', 'BUSAN', NOW(), NOW()),
(gen_random_uuid(), '창원 NC 파크', 'CHANGWON', NOW(), NOW()),
(gen_random_uuid(), '포항 야구장', 'POHANG', NOW(), NOW()),
(gen_random_uuid(), '울산 문수 야구장', 'ULSAN', NOW(), NOW())
ON CONFLICT (name) DO NOTHING; -- 이미 같은 이름의 구장이 있으면 무시
