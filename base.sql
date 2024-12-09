-- Active: 1729559052990@@127.0.0.1@5432@likeme
CREATE DATABASE likeme;

\c likeme

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(25),
  img VARCHAR(1000),
  descripcion VARCHAR(255),
  likes INT DEFAULT 0
);
