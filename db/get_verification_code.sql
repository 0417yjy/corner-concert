DELIMITER $$
 
DROP FUNCTION IF EXISTS GET_VERIFICATION_CODE;
 
CREATE FUNCTION GET_VERIFICATION_CODE(in_email VARCHAR(50)) RETURNS VARCHAR(8)
BEGIN
    -- 만료된 코드 삭제
    DELETE FROM verification_register WHERE expires < NOW();
    -- 해당하는 이메일 리턴
    RETURN (SELECT code FROM verification_register WHERE email=in_email);
END $$
 
DELIMITER ;
