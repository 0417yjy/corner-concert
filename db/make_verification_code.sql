DELIMITER $$
 
DROP PROCEDURE IF EXISTS MAKE_VERIFICATION_CODE;
 
CREATE PROCEDURE MAKE_VERIFICATION_CODE(IN in_email VARCHAR(50), OUT )
 
BEGIN
     DECLARE v_verification_code CHAR(8);
     DECLARE v_temp_code CHAR(56);
     DECLARE v_

     -- SHA-224로 암호화
     SELECT SHA2(email, 224) INTO temp_code;
     -- 10번째 인덱스부터 8자리 읽음
     SELECT SUBSTR(temp_code, 10, 8) INTO verification_code;

     IF (SELECT email FROM verification_reigster WHERE email=in_email) THEN
          -- 이메일이 이미 존재하는경우, expires 기한을 현재 기준으로 다시 업데이트
          UPDATE 
     
END $$
 
DELIMITER ;
