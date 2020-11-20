CREATE DATABASE tesis;

USE tesis;

--usuariossssssssss
  CREATE TABLE users (
    id INT(11) NOT NULL PRIMARY KEY auto_increment,
    user_id  INT(11),
    idmanagerworker INT(11) NOT NULL,
    username VARCHAR(25) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    resetPasswordToken VARCHAR(16),
        resetPasswordExpires datetime,
        isManager BOOLEAN,
        isAdmin BOOLEAN,
        isWorker BOOLEAN,
        available BOOLEAN
  );
insert into users values 
(1, 1, 1, 'israel', '$2y$12$M./DAFoopX8MdIAAUWmXBeQlxOmAGf4xp7mmowlasqO7cCm2jkHm.', 'i52ael', '',now(),1,1,1,1);
-- TABLE USER
-- all pasword wil be encrypted using SHA1
/*
CREATE TABLE users (
  id INT(11) NOT NULL,
   username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
 
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
*/
DESCRIBE users;
/*
INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');
*/
insert into users values 
(1, 1, 'israel', '$2y$12$M./DAFoopX8MdIAAUWmXBeQlxOmAGf4xp7mmowlasqO7cCm2jkHm.', 'i52ael', '',now(),1,1,1,1);
SELECT * FROM users;

-- LINKS TABLE
-- drop table if exists links;
CREATE TABLE links (
  id INT(11) NOT NULL primary key auto_increment,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
-- compras TABLE
-- drop table if exists links;
CREATE TABLE Compras (
  id INT(11) NOT NULL primary key auto_increment,
  NIT INT(11) NOT NULL,
  PROVEEDOR VARCHAR(150) NOT NULL,
  FACTURA INT(11) NOT NULL,
  AUTORIZACION INT(20) NOT NULL,
  FECHA datetime NOT NULL,
  MONTO FLOAT NOT NULL,
  PAGADO FLOAT NOT NULL,
  IVA FLOAT NOT NULL,
  ORDEN VARCHAR(15) NOT NULL,
  
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
ALTER TABLE Compras
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;



-- Manager TABLE
CREATE TABLE Manager (

  id INT(11) NOT NULL primary key auto_increment,
  
  Nombre VARCHAR(150) NOT NULL,
  
  Apellido VARCHAR(255) NOT NULL,
  
  Birthday datetime,
  
  Descripcion VARCHAR(150) NOT NULL,
  
  user_id INT(11),
  
  Available Boolean DEFAULT TRUE,
  
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  
  CONSTRAINT fk_user1 FOREIGN KEY(user_id) REFERENCES users(id)
);
/*
ALTER TABLE Manager
  ADD PRIMARY KEY (id);

ALTER TABLE Manager
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1000;
*/
  -- Worker TABLE
CREATE TABLE Worker (
  id INT(11) NOT NULL primary key auto_increment,
  Nombre VARCHAR(150) NOT NULL,
  Apellido VARCHAR(255) NOT NULL,
  Birthday datetime,
  Descripcion VARCHAR(150) NOT NULL,
  user_id INT(11),
  Available Boolean DEFAULT TRUE,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user2 FOREIGN KEY(user_id) REFERENCES users(id)
);
/*
ALTER TABLE Worker
  ADD PRIMARY KEY (id);

ALTER TABLE Worker
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1000;
*/


  CREATE TABLE columnas_compras (
    id INT(11) NOT NULL PRIMARY KEY auto_increment,
    nombre varchar (50),
    tipo_dato varchar(30),
    orden INT (11) NOT NULL DEFAULT 1,
    estado boolean
  );

  INSERT INTO `columnas_compras`(`nombre`, `tipo_dato`, `orden`, `estado`) VALUES ('NIT','INT','1','1'),
('CLIENTE','VARCHAR','2','1'),
('NUMERO AUTORIZACION','INT','3','1'),
('FECHA','DATE','4','1'),
('MONTO','FLOAT','5','1'),
('COBRADO','FLOAT','6','1'),
('IVA','FLOAT','7','1'),
('V/A','VARCHAR','8','1')

CREATE TABLE tablas (

  id INT(11) NOT NULL primary key auto_increment,
  
  TABLA VARCHAR(150) NOT NULL,
  
  NUMERO INT NOT NULL,
    MINIMO_COLUMNAS INT NOT NULL,
  );
  
  INSERT INTO `tablas`(`TABLA`, `NUMERO`, `MINIMO_COLUMNAS`) VALUES 
  ('compras','1','3'),
  ('ventas','2','3'),
  ('depreciacion','3','3'),
  ('rendiciones','4','3'),
  ('traspasos','5','3'),
  ('clientes','6','3'),
  ('detalle','7','3'),
  ('items','8','3'),
  ('kardex','9','3'),
  ('proveedores','10','3')

