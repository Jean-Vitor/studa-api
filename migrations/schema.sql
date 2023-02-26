CREATE DATABASE "studa";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users
(
  id         uuid                                               not null unique default uuid_generate_v4(),
  name       varchar                                            not null,
  email      varchar unique                                     not null,
  password   varchar                                            not null,
  created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
  updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);
CREATE TABLE IF NOT EXISTS confirmation_tokens
(
  id                 uuid                     default uuid_generate_v4() not null primary key,
  confirmation_token varchar(255)                                        not null,
  user_id            uuid,
  created_at         timestamp with time zone default CURRENT_TIMESTAMP  not null,
  updated_at         timestamp with time zone default CURRENT_TIMESTAMP  not null,
  foreign key (user_id) references users (id)
);
CREATE TABLE IF NOT EXISTS refresh_tokens
(
  id            uuid primary key         not null default uuid_generate_v4(),
  refresh_token character varying(255)   not null,
  user_id       uuid,
  created_at    timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at    timestamp with time zone not null default CURRENT_TIMESTAMP,
  foreign key (user_id) references users (id)
);
