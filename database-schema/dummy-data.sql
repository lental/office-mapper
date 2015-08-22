INSERT INTO maps (id, name) VALUES (1, "Santa Clara"), (2, "Guadalajara"), (3, "London"), (4, "Stockholm");

INSERT INTO sections (id, name, map_id, xpos, ypos, width, height) VALUES
    (1, "Engineering Area", 1, 0, 0, 600, 600),
    (2, "Non-engineering Area", 1, 0, 650, 600, 300);

INSERT INTO users (id, name, desk_id, email, thumbnail, admin) VALUES
  (1, "Michael Len", 1, "michael.len@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECNn4_9WI4pz-nwEiC3ZjYXJkX3Bob3RvKigwMWJlMmFjZjk2YWFlMzkyODQ1MmZmYzc4OTQ1ZTQ0Y2UzMDM1MWRjMAHNy1tiC-4vJNOiL2aadmRRetRhNw", 1),
  (2, "Evan Danaher", 3, "edanaher@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECK_gsp7dy8m9rgEiC3ZjYXJkX3Bob3RvKig1NDg4OWY0MGRhMmVhY2JlMWQxYjIzZDhhODEwYmRiYjRlOWY0YTE2MAHOrq89PJK7IN_axRHXyfdI2l9EYw", 0),
  (3, "Dustin Preuss", 2, "dustin@ooyala.com", "https://plus.google.com/_/focus/photos/private/AIbEiAIAAABDCOflwJPz89jUCiILdmNhcmRfcGhvdG8qKDJiODcxOWU0OWRjYzNkODBlYzQ3OWE0ZjA3ZGZhNmVlYThjMjY1NzQwAVbjtYb5KNg9HaM3FMlxZtTKGtkm", 1),
  (4, "Aakash Desai", 5, "aakashd@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCK-D8sSEooTkOiILdmNhcmRfcGhvdG8qKDUzOWQ5ODAzMDYzZjEzZDY4YzE1NWEwZTBjNjQ3MGU5ZWY3NmRkNWEwASoMw93ae0IKgnvra5L_pssOEYYh", 0),
  (5, "Aanal Bhatt", 6, "aanalbhatt@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECKT4mvKzvrbQrQEiC3ZjYXJkX3Bob3RvKigzY2I1ZmRjODI5MTBhOWRiNGM4MDJjZGEwY2YxYzU2ZDhlYWRhNmI1MAGXXraqMI1ApYCU3KX1M_6NJy5zsw", 0),
  (6, "Aaron Carr", 7, "aaronc@ooyala.com", NULL, 0),
  (7, "Abel Rios", 8, "abelrios@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCNmJl4Cunf-aSyILdmNhcmRfcGhvdG8qKDg3OWJlZDY2MWZlNTU5YmNjYTBhYzMxMWFhM2RjM2UyOGRiMmVmNmMwAYqy3f5l36WA_z-rEcMkNEEGpaoN", 0);

INSERT INTO rooms (id, name, section_id, xpos, ypos, width, height, tv, phone, chromecast, seats) VALUES
  (1, "Shawshank Redemption", 1, 10, 110, 20, 40, 1, 1, 1, 4),
  (2, "Zamba", 2, 40, 90, 30, 80, 1, 1, 1, 20);

INSERT INTO places (id, name, description, section_id, xpos, ypos, width, height) VALUES
  (1, "Main kitchen", "Where we eat", 1, 200, 10, 100, 100),
  (2, "Electrical room", "Where electrons eat", 1, 50, 60, 10, 20),
  (3, "Bathroom", "Where baths eat", 2, 110, 110, 50, 50);

INSERT INTO desk_groups (id, name, section_id, xpos, ypos) VALUES
  (1, NULL, 1, 10, 160),
  (2, "Cool kids", 1, 40, 120),
  (3, "HR or something", 2, 80, 20),
  (4, NULL, 2, 100, 80);

INSERT INTO desks (id, name, desk_group_id, xpos, ypos, length, depth, rotation) VALUES
  (1, NULL, 1, 0, 0, 60, 20, 0),
  (2, NULL, 1, 60, 0, 60, 20, 0),
  (3, NULL, 1, 0, 20, 60, 20, 0),
  (4, NULL, 1, 60, 20, 60, 20, 0),

  (5, "Cool", 2, 0, 0, 60, 20, 1),
  (6, "Cooler", 2, 0, 60, 60, 20, 1),

  (7, "Nice HR", 3, 0, 60, 20, 0, 0),
  (8, "Mean HR", 3, 20, 60, 20, 0, 0),

  (9, "Janky lonely small desk", 4, 0, 0, 50, 15, 0);
