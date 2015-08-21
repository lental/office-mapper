CREATE TABLE maps (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE sections (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  map_id INT NOT NULL,
  xpos INT NOT NULL,
  ypos INT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  KEY map_id (map_id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  thumbnail VARCHAR(1024),
  admin BIT NOT NULL,
  desk_it INT
);

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  section_id INT NOT NULL,
  xpos INT NOT NULL,
  ypos INT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  tv BIT NOT NULL,
  phone BIT NOT NULL,
  chromecast BIT NOT NULL,
  chairs INT NOT NULL,
  KEY section_id (section_id),
  KEY tv (tv),
  KEY phone (phone),
  KEY chromecast (chromecast),
  KEY chairs (chairs)
);

CREATE TABLE places (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  description VARCHAR(256) NOT NULL,
  section_id INT NOT NULL,
  xpos INT NOT NULL,
  ypos INT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL
);
-- TODO(edanaher): key/value pairs for metadata

CREATE TABLE desk_groups (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64), -- Optional - can be null
  section_id INT NOT NULL,
  xpos INT NOT NULL,
  ypos INT NOT NULL
  -- Width and height are computed from contained desks
);

CREATE TABLE desks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64), -- Optional - can be null
  desk_group_id INT NOT NULL,
  xpos INT NOT NULL,
  ypos INT NOT NULL,
  length INT NOT NULL DEFAULT 60,
  depth INT NOT NULL DEFAULT 20,
  rotation INT NOT NULL
);

