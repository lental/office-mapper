INSERT INTO maps (id, name) VALUES (1, "Santa Clara"), (2, "Guadalajara"), (3, "London"), (4, "Stockholm"), (5, "Dallas");

INSERT INTO sections (id, name, map_id, xpos, ypos, width, height) VALUES
    (1, "Engineering Area", 1, 10, 10, 1350, 400),
    (2, "Walkway Area", 1, 10, 410, 1350, 400),
    (3, "Non-engineering Area", 1, 10, 810, 1350, 400),
    (4, "GDL Part 1", 2, 10, 10, 300, 500),
    (5, "GDL Part 2", 2, 10, 310, 200, 400),
    (6, "London Office", 3, 10, 10, 1000, 1000),
    (7, "Dallas Office", 5, 10, 10, 400, 500);

INSERT INTO users (id, name, desk_id, email, thumbnail_url, gplus_id, admin) VALUES
  (1, "Michael Len", 1, "michael.len@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECNn4_9WI4pz-nwEiC3ZjYXJkX3Bob3RvKigwMWJlMmFjZjk2YWFlMzkyODQ1MmZmYzc4OTQ1ZTQ0Y2UzMDM1MWRjMAHNy1tiC-4vJNOiL2aadmRRetRhNw", 111528215661046135897, 1),
  (2, "Evan Danaher", 3, "edanaher@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECK_gsp7dy8m9rgEiC3ZjYXJkX3Bob3RvKig1NDg4OWY0MGRhMmVhY2JlMWQxYjIzZDhhODEwYmRiYjRlOWY0YTE2MAHOrq89PJK7IN_axRHXyfdI2l9EYw", 112572684969162092591, 0),
  (3, "Dustin Preuss", 2, "dustin@ooyala.com", "https://plus.google.com/_/focus/photos/private/AIbEiAIAAABDCOflwJPz89jUCiILdmNhcmRfcGhvdG8qKDJiODcxOWU0OWRjYzNkODBlYzQ3OWE0ZjA3ZGZhNmVlYThjMjY1NzQwAVbjtYb5KNg9HaM3FMlxZtTKGtkm", 100768254746840543975, 1),
  (4, "Aakash Desai", 5, "aakashd@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCK-D8sSEooTkOiILdmNhcmRfcGhvdG8qKDUzOWQ5ODAzMDYzZjEzZDY4YzE1NWEwZTBjNjQ3MGU5ZWY3NmRkNWEwASoMw93ae0IKgnvra5L_pssOEYYh", 104235654211177316783, 0),
  (5, "Aanal Bhatt", 6, "aanalbhatt@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECKT4mvKzvrbQrQEiC3ZjYXJkX3Bob3RvKigzY2I1ZmRjODI5MTBhOWRiNGM4MDJjZGEwY2YxYzU2ZDhlYWRhNmI1MAGXXraqMI1ApYCU3KX1M_6NJy5zsw", 112511239403580341284, 0),
  (6, "Aaron Carr", 7, "aaronc@ooyala.com", NULL, 105266251472533597991, 0),
  (7, "Abel Rios", 10, "abelrios@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCNmJl4Cunf-aSyILdmNhcmRfcGhvdG8qKDg3OWJlZDY2MWZlNTU5YmNjYTBhYzMxMWFhM2RjM2UyOGRiMmVmNmMwAYqy3f5l36WA_z-rEcMkNEEGpaoN",105419515812321281241, 0);

INSERT INTO rooms (id, name, section_id, xpos, ypos, width, height, tv, phone, chromecast, seats) VALUES
  (1, "Shawshank Redemption", 1, 110, 20, 90, 90, 1, 1, 1, 4),
  (2, "Gattaca", 1, 200, 20, 90, 90, 1, 1, 1, 4),
  (3, "Men In Black", 1, 400, 200, 40, 40, 1, 1, 1, 4),
  (4, "Time Bandits", 1, 440, 200, 40, 40, 1, 1, 1, 4),
  (5, "Playback Lab", 1, 400, 240, 80, 50, 1, 1, 1, 4),
  (6, "Wraith Of Khan", 1, 400, 290, 80, 50, 1, 1, 1, 4),
  (7, "The Matrix", 1, 480, 200, 100,70, 1, 1, 1, 4),
  (8, "Avatar", 1, 480, 270, 100,70, 1, 1, 1, 4),
  (12, "Zamba", 2, 40, 90, 30, 80, 1, 1, 1, 20);

INSERT INTO places (id, name, description, section_id, xpos, ypos, width, height) VALUES
  (1, "Secondary kitchen", "Where we eat", 2, 40, 120, 100, 100),
  (2, "Electrical room", "Where electrons eat", 1, 200, 150, 100, 120),
  (3, "Bathroom", "Where baths eat", 2, 210, 110, 100, 100);

INSERT INTO desk_groups (id, name, section_id, xpos, ypos) VALUES
  (1, NULL, 1, 10, 160),
  (2, "Cool kids", 1, 40, 120),
  (3, "HR or something", 2, 80, 20),
  (4, NULL, 2, 100, 80),
  (5, "Dallas eng cluster", 3, 40, 40);

INSERT INTO desks (id, name, desk_group_id, xpos, ypos, width, height, rotation) VALUES
  (1, NULL, 1, 0, 0, 60, 20, 0),
  (2, NULL, 1, 60, 0, 60, 20, 0),
  (3, NULL, 1, 0, 20, 60, 20, 0),
  (4, NULL, 1, 60, 20, 60, 20, 0),

  (5, "Cool", 2, 0, 0, 60, 20, 1),
  (6, "Cooler", 2, 0, 60, 60, 20, 1),

  (7, "Nice HR", 3, 0, 60, 20, 0, 0),
  (8, "Mean HR", 3, 20, 60, 20, 0, 0),

  (9, "Janky lonely small desk", 4, 0, 0, 50, 15, 0),

  (10, "Big Texas Desk", 5, 0, 0, 90, 30, 0);
