DELIMITER $$
 
DROP PROCEDURE IF EXISTS MAKE_VERIFICATION_CODE;
 
CREATE PROCEDURE MAKE_VERIFICATION_CODE(IN in_email VARCHAR(50))
 
BEGIN
     DECLARE v_verification_code CHAR(8);
     DECLARE v_temp_code CHAR(56);
     DECLARE v_expire_date DATETIME;

     -- SHA-224로 암호화
     SELECT SHA2(in_email, 224) INTO v_temp_code;
     -- 10번째 인덱스부터 8자리 읽어서 verification code 생성
     SELECT SUBSTR(v_temp_code, 10, 8) INTO v_verification_code;
     -- 만료 시간 생성 (3분 후)
     SELECT DATE_ADD(NOW(), INTERVAL 3 MINUTE) INTO v_expire_date;

     IF (SELECT email FROM verification_register WHERE email=in_email) THEN
          -- 이메일이 이미 존재하는경우, expires 기한을 현재 기준으로 다시 업데이트
          UPDATE verification_register SET expires=v_expire_date WHERE email=in_email;
     ELSE
          INSERT INTO verification_register (email, code, expires) VALUES (in_email, v_verification_code, v_expire_date);
     END IF;
END $$
 
DELIMITER ;
