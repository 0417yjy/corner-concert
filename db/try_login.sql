DELIMITER $$
 
DROP PROCEDURE IF EXISTS TRY_LOGIN;
 
CREATE PROCEDURE TRY_LOGIN(IN in_id VARCHAR(32), IN in_pw CHAR(88))
 
BEGIN
     SELECT login_id, nickname, email, bio FROM user WHERE login_id=in_id AND pw=SHA2(in_pw, 256);
END $$
 
DELIMITER ;
