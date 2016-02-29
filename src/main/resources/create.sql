DROP TABLE user;

CREATE TABLE user
(
id_user varchar(128) NOT NULL,
login  varchar(50) NOT NULL,
pass  varchar(50)  NOT NULL,
first_name varchar(50) NOT NULL,
last_name varchar(50) NOT NULL,
adress varchar(50) NOT NULL,
email varchar(50) NOT NULL,
PRIMARY KEY (id_user)
);