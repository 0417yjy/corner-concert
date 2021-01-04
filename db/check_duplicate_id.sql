DELIMITER $$
 
DROP FUNCTION IF EXISTS CHECK_DUPLICATE_ID;
 
CREATE FUNCTION CHECK_DUPLICATE_ID(in_login_id VARCHAR(32)) RETURNS BOOLEAN
BEGIN
    -- 이미 id가 존재하면 1, 아니면 0 리턴
    RETURN (
        SELECT 
            CASE WHEN EXISTS
                (SELECT id FROM user WHERE login_id=in_login_id)
            THEN TRUE
            ELSE FALSE
            END
        FROM DUAL
    );  
END $$
 
DELIMITER ;
