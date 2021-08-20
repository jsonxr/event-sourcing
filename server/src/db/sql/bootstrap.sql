-- postgres-migrations disable-transaction

--------------------------------------------------------------------------------
-- bootstrap.sql
--------------------------------------------------------------------------------

/**
  - Why do some tables have auto generated keys that start at 10,000?
      Reserving values below 10,000 enables us to use demo data in production.
      Any demo data we insert into tables will have keys less than 10,000 and
      can be safely delted/refreshed.

  - Why do you have this on tables that will never contain demo data?
      Shrug... (mumble) I don't know.  Why not?

*/

SET TIME ZONE 0;

----------------------------------------
-- cache_times
----------------------------------------
-- CREATE TABLE cache_times (
--   cache_time_id SERIAL PRIMARY KEY,
--   table_name VARCHAR(255),
--   cached_at_utc NOT NULL TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- )


----------------------------------------
-- funding_types
----------------------------------------
CREATE TABLE funding_types (
  funding_type_id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL, -- sales force identifier
  name VARCHAR(255)
  -- cached_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER SEQUENCE funding_types_funding_type_id_seq RESTART WITH 10000;
ALTER TABLE funding_types
  ADD CONSTRAINT funding_types_code UNIQUE (code);


----------------------------------------
-- national_offices
----------------------------------------
CREATE TABLE national_offices (
  national_office_id SERIAL PRIMARY KEY,
  code VARCHAR(2) NOT NULL, -- sales force human readable Examples: GH,PE
  name VARCHAR(255)
  -- cached_at_utc NOT NULL TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE national_offices
  ADD CONSTRAINT national_offices_code UNIQUE (code);
ALTER SEQUENCE national_offices_national_office_id_seq RESTART WITH 10000;
CREATE UNIQUE INDEX idx_national_offices_code ON national_offices (code);


----------------------------------------
-- fcps
----------------------------------------
CREATE TABLE fcps (
  fcp_id SERIAL PRIMARY KEY,
  national_office_id INTEGER NOT NULL,
  code VARCHAR(6) NOT NULL, -- sales force human readable
  name VARCHAR(255)
  -- cached_at_utc NOT NULL TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER SEQUENCE fcps_fcp_id_seq RESTART WITH 10000;
ALTER TABLE fcps
  ADD CONSTRAINT fcps_code UNIQUE (code);
ALTER TABLE fcps
  ADD CONSTRAINT fk_fcps_national_office_id
  FOREIGN KEY (national_office_id)
  REFERENCES national_offices(national_office_id);
CREATE UNIQUE INDEX idx_fcps_code ON fcps (code);
CREATE INDEX idx_fcps_national_office_id ON fcps (national_office_id);

----------------------------------------
-- beneficiaries
----------------------------------------
CREATE TABLE beneficiaries (
  beneficiary_id SERIAL PRIMARY KEY, -- autogenerate
  global_id VARCHAR(10) NOT NULL,	 -- salesforce generated
  local_id VARCHAR(11),				 -- human generated
  fcp_id INTEGER NOT NULL DEFAULT 0,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  preferred_name VARCHAR(255),
  gender VARCHAR(1),
  sponsored BOOLEAN,
  birth_date DATE,
  funding_type_id INTEGER NOT NULL DEFAULT 0,
  profile_photo_url VARCHAR(255),
  profile_photo_date DATE
);
ALTER SEQUENCE beneficiaries_beneficiary_id_seq RESTART WITH 10000;
ALTER TABLE beneficiaries
  ADD CONSTRAINT fk_beneficiaries_fcp_id
  FOREIGN KEY (fcp_id)
  REFERENCES fcps(fcp_id);
ALTER TABLE beneficiaries
  ADD CONSTRAINT beneficiaries_global_id UNIQUE (global_id);
ALTER TABLE beneficiaries
  ADD CONSTRAINT fk_beneficiaries_funding_type_id
  FOREIGN KEY (funding_type_id)
  REFERENCES funding_types(funding_type_id);
CREATE INDEX idx_beneficiaries_fcp_id ON beneficiaries(fcp_id);
CREATE UNIQUE INDEX idx_beneficiaries_global_id ON beneficiaries (global_id);

----------------------------------------
-- photo_status
----------------------------------------
CREATE TABLE photo_status (
  photo_status_id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);
ALTER SEQUENCE photo_status_photo_status_id_seq RESTART WITH 10000;


----------------------------------------
-- photos
----------------------------------------
CREATE TABLE photos (
  photo_id SERIAL PRIMARY KEY,
  beneficiary_id INTEGER NOT NULL DEFAULT 0,
  url VARCHAR(255) NOT NULL,
  photo_status_id INTEGER NOT NULL,
  image_analysis JSONB,
  height INTEGER,
  width INTEGER,
  bytes INTEGER,
  created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  tags JSONB,
  context JSONB
);
ALTER SEQUENCE photos_photo_id_seq RESTART WITH 10000;
ALTER TABLE photos
	ADD CONSTRAINT fk_photos_beneficiary_id
	FOREIGN KEY (beneficiary_id)
	REFERENCES beneficiaries(beneficiary_id);
ALTER TABLE photos
	ADD CONSTRAINT fk_photos_status_id
	FOREIGN KEY (photo_status_id)
	REFERENCES photo_status(photo_status_id);
ALTER TABLE photos
  ADD CONSTRAINT photos_url UNIQUE (url);
CREATE INDEX idx_photos_beneficiary_id ON photos(beneficiary_id);

----------------------------------------
-- processing_photos
----------------------------------------
CREATE TABLE processing_photos (
  processing_photos_id SERIAL PRIMARY KEY,
  photo_id INTEGER,
  photo_status_id INTEGER
);
ALTER SEQUENCE processing_photos_processing_photos_id_seq RESTART WITH 10000;
ALTER TABLE processing_photos
  ADD CONSTRAINT fk_processing_photos_photo_id
  FOREIGN KEY (photo_id)
  REFERENCES photos(photo_id);
ALTER TABLE processing_photos
  ADD CONSTRAINT fk_processing_photos_photo_status_id
  FOREIGN KEY (photo_status_id)
  REFERENCES photo_status(photo_status_id);
CREATE INDEX idx_processing_photos_photo_id ON processing_photos(photo_id);
CREATE INDEX idx_processing_photos_photo_status_id ON processing_photos(photo_status_id);

----------------------------------------
-- returned_reasons
----------------------------------------
CREATE TABLE returned_reasons (
  returned_reason_id SERIAL PRIMARY KEY,
  name VARCHAR(255)
); -- 0 other, blurry, ...
ALTER SEQUENCE returned_reasons_returned_reason_id_seq RESTART WITH 10000;


----------------------------------------
-- users
----------------------------------------
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  -- salesforce_id? ,
  email varchar(255) NOT NULL
);
ALTER SEQUENCE users_user_id_seq RESTART WITH 10000;
ALTER TABLE users
  ADD CONSTRAINT users_email UNIQUE (email);


----------------------------------------
-- photo_history
----------------------------------------
CREATE TABLE photo_history (
  photo_history_id SERIAL PRIMARY KEY,
  photo_id INTEGER NOT NULL,
  modified_by_id INTEGER NOT NULL,
  modified_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  photo_status_id INTEGER NOT NULL DEFAULT 0,
  returned_reason_id INTEGER NULL,
  comment TEXT
);
ALTER SEQUENCE photo_history_photo_history_id_seq RESTART WITH 10000;
ALTER TABLE photo_history
  ADD CONSTRAINT fk_photo_history_photo_id
  FOREIGN KEY (photo_id)
  REFERENCES photos(photo_id);
ALTER TABLE photo_history
  ADD CONSTRAINT fk_photo_history_modified_by_id
  FOREIGN KEY (modified_by_id)
  REFERENCES users(user_id);
ALTER TABLE photo_history
  ADD CONSTRAINT fk_photo_history_status_id
  FOREIGN KEY (photo_status_id)
  REFERENCES photo_status(photo_status_id);
ALTER TABLE photo_history
  ADD CONSTRAINT fk_photo_history_returned_reason_id
  FOREIGN KEY (returned_reason_id)
  REFERENCES returned_reasons(returned_reason_id);
