DROP TABLE USERS;

CREATE TABLE USERS
(
    id_user VARCHAR(128) PRIMARY KEY NOT NULL,
    login  VARCHAR(50) NOT NULL,
    pass  VARCHAR(50)  NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    adress VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);