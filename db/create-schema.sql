/*
 * File: create-schema.sql
 * Project: corner-concert
 * File Created: Sunday, 27th December 2020 11:04:45 pm
 * Author: Jongyeon Yoon (0417yjy@naver.com)
 * -----
 * Last Modified: Monday, 28th December 2020 12:36:43 am
 * Modified By: Jongyeon Yoon (0417yjy@naver.com>)
 * -----
 * Copyright 2020 CoCo Dev Team
 */

# database name: 'coco'

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT, # DB 내부의 숫자 id
    nickname VARCHAR(32) NOT NULL, # 닉네임 (중복가능)
    login_id VARCHAR(32) NOT NULL UNIQUE, # 로그인 시 사용하는 아이디 (중복불가)
    email VARCHAR(50) NOT NULL UNIQUE, # 이메일 (검증에 필요)
    bio VARCHAR(120), # 상태 메시지
    pw CHAR(64) NOT NULL # 비밀번호
);

CREATE TABLE instrument (
    id INT PRIMARY KEY AUTO_INCREMENT,
    initial CHAR(1) NOT NULL, # 악기 이니셜
    inst_name VARCHAR(20) NOT NULL, # 악기 이름
    bgcolor CHAR(7) DEFAULT '#000000', #프로필 상에서의 아이콘 배경색 '#rrggbb'
    fontcolor CHAR(7) DEFAULT '#ffffff' #프로필 상에서의 아이콘 폰트 색
);

INSERT INTO instrument (initial, inst_name, bgcolor, fontcolor) VALUES ('G', 'Guitar', '#ff0000', '#ffffff');
INSERT INTO instrument (initial, inst_name, bgcolor, fontcolor) VALUES ('B', 'Bass', '#0000ff', '#ffffff');
INSERT INTO instrument (initial, inst_name, bgcolor, fontcolor) VALUES ('V', 'Vocal', '#ffff00', '#000000');
INSERT INTO instrument (initial, inst_name, bgcolor, fontcolor) VALUES ('K', 'Keyboard', '#f1f1f1', '#000000');
INSERT INTO instrument (initial, inst_name, bgcolor, fontcolor) VALUES ('D', 'Drum', '#16a085', '#ffffff');

CREATE TABLE user_instrument (
    user_id INT NOT NULL,
    inst_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (inst_id) REFERENCES instrument (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, inst_id)
);