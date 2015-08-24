INSERT INTO maps (id, name) VALUES (1, "Santa Clara"), (2, "Guadalajara"), (3, "London"), (4, "Stockholm"), (5, "Dallas");

INSERT INTO sections (id, name, map_id, xpos, ypos, width, height) VALUES
    (1, "Engineering", 1, 10, 10, 1550, 400),
    (2, "Walkway", 1, 10, 410, 1550, 440),
    (3, "Business", 1, 10, 850, 1550, 240),
    (4, "GDL Part 1", 2, 10, 10, 300, 500),
    (5, "GDL Part 2", 2, 10, 310, 200, 400),
    (6, "London Office", 3, 10, 10, 1000, 1000),
    (7, "Dallas Office", 5, 10, 10, 450, 670),
    (8, "Kitchen", 1, 1560, 300, 1000, 790),
    (9, "Lobby", 1, 1560, 1090, 1000, 470);

INSERT INTO users (id, name, desk_id, email, thumbnail_url, gplus_id, admin) VALUES
  (1, "Michael Len", 1, "michael.len@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECNn4_9WI4pz-nwEiC3ZjYXJkX3Bob3RvKigwMWJlMmFjZjk2YWFlMzkyODQ1MmZmYzc4OTQ1ZTQ0Y2UzMDM1MWRjMAHNy1tiC-4vJNOiL2aadmRRetRhNw", 111528215661046135897, 1),
  (2, "Evan Danaher", 3, "edanaher@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECK_gsp7dy8m9rgEiC3ZjYXJkX3Bob3RvKig1NDg4OWY0MGRhMmVhY2JlMWQxYjIzZDhhODEwYmRiYjRlOWY0YTE2MAHOrq89PJK7IN_axRHXyfdI2l9EYw", 112572684969162092591, 0),
  (3, "Dustin Preuss", 2, "dustin@ooyala.com", "https://plus.google.com/_/focus/photos/private/AIbEiAIAAABDCOflwJPz89jUCiILdmNhcmRfcGhvdG8qKDJiODcxOWU0OWRjYzNkODBlYzQ3OWE0ZjA3ZGZhNmVlYThjMjY1NzQwAVbjtYb5KNg9HaM3FMlxZtTKGtkm", 100768254746840543975, 1),
  (4, "Gone McLeaverson", 5, "gone@ooyala.com", "", 11111, 0),
  (5, "Aanal Bhatt", 6, "aanalbhatt@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECKT4mvKzvrbQrQEiC3ZjYXJkX3Bob3RvKigzY2I1ZmRjODI5MTBhOWRiNGM4MDJjZGEwY2YxYzU2ZDhlYWRhNmI1MAGXXraqMI1ApYCU3KX1M_6NJy5zsw", 112511239403580341284, 0),
  (6, "Aaron Carr", 7, "aaronc@ooyala.com", NULL, 105266251472533597991, 0),
  (7, "Abel Rios", 36, "abelrios@ooyala.com", "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCNmJl4Cunf-aSyILdmNhcmRfcGhvdG8qKDg3OWJlZDY2MWZlNTU5YmNjYTBhYzMxMWFhM2RjM2UyOGRiMmVmNmMwAYqy3f5l36WA_z-rEcMkNEEGpaoN",105419515812321281241, 0);

INSERT INTO rooms (id, name, section_id, xpos, ypos, width, height, tv, phone, chromecast, seats) VALUES
  (9, "Telstra1", 1, 0, 0, 100,100, 1, 1, 1, 4),
  (10, "Telstra2", 1, 0, 100, 100,100, 1, 1, 1, 4),

  (1, "Shawshank Redemption", 1,410, 20, 90, 90, 1, 1, 1, 4),
  (2, "Gattaca", 1, 500, 20, 90, 90, 1, 1, 1, 4),

  (3, "Men In Black", 1, 700, 200, 40, 40, 1, 1, 1, 4),
  (4, "Time Bandits", 1, 740, 200, 40, 40, 1, 1, 1, 1),
  (5, "Playback Lab", 1, 700, 240, 80, 50, 1, 1, 1, 4),
  (6, "Wraith Of Khan", 1, 700, 290, 80, 50, 1, 1, 1, 4),
  (7, "The Matrix", 1, 780, 200, 100,70, 1, 1, 1, 10),
  (8, "Avatar", 1, 780, 270, 100,70, 1, 1, 1, 10),
  (11, "Return of the Jedi", 1, 880, 200, 40, 40, 1, 1, 1, 1),
  (12, "The Empire Strikes Back", 1, 920, 200, 40, 40, 1, 1, 1, 1),
  (13, "Best in Show", 1, 880, 240, 80, 50, 1, 1, 1, 4),
  (14, "Aliens", 1, 880, 290, 80, 50, 1, 1, 1, 4),

  (15, "Boogie Nights", 1, 1080, 20, 90, 90, 1, 1, 1, 4),
  (16, "Inception", 1, 1170, 20, 90, 90, 1, 1, 1, 4),


  (17, "Risky Business", 2, 280, 320, 70, 80, 1, 1, 1, 4),
  (18, "Fight Club", 2, 350, 320, 100, 80, 1, 1, 1, 6),
  (19, "Mission Impossible", 2, 450, 320, 100, 80, 1, 1, 1, 6),
  (20, "Jerry Maguire", 2, 550, 320, 70, 80, 1, 1, 1, 4),

  (21, "Live and Let Die", 2, 660, 90, 50, 50, 1, 1, 1, 1),
  (22, "Thunderball", 2, 660, 140, 50, 50, 1, 1, 1, 1),
  (23, "Dr. No", 2, 660, 190, 50, 50, 1, 1, 1, 1),
  (24, "Casino Royale", 2, 660, 240, 50, 80, 1, 1, 1, 2),
  (25, "Cats and Dogs", 2, 660, 320, 50, 80, 1, 1, 1, 2),
  (26, "Good Will Hunting", 2, 710, 90, 100, 150, 1, 1, 1, 10),
  (27, "Up", 2, 710, 240, 100, 160, 1, 1, 1, 8),

  (28, "Sideways", 2, 930, 90, 100, 160, 1, 1, 1, 8),
  (29, "Caddyshack", 2, 930, 240, 100, 160, 1, 1, 1, 10),
  (30, "For Your Eyes Only", 2, 1030, 90, 50, 50, 1, 1, 1, 1),
  (31, "Skyfall", 2, 1030, 140, 50, 50, 1, 1, 1, 1),
  (32, "License to Kill", 2, 1030, 190, 50, 50, 1, 1, 1, 1),
  (33, "Moonraker", 2, 1030, 240, 50, 80, 1, 1, 1, 2),
  (34, "The Spy Who Loved Me", 2, 1030, 320, 50, 80, 1, 1, 1, 2),

  (35, "Limitless", 2, 1120, 90, 100, 100, 1, 1, 1, 4),
  (36, "Moneyball", 2, 1120, 300, 100, 100, 1, 1, 1, 7),

  (37, "Great Race", 2, 1310, 90, 100, 100, 1, 1, 1, 5),
  (38, "Turner and Hooch", 2, 1310, 190, 100, 110, 1, 1, 1, 5),
  (39, "The Firm", 2, 1310, 300, 100, 100, 1, 1, 1, 7),

  (40, "The Lost Boys", 2, 1450, 270, 100, 130, 1, 1, 1, 10),


  (41, "Pulp Fiction", 8, 0, 420, 100, 90, 1, 1, 1, 6),

  (42, "Goodfellas", 8, 140, 200, 150, 90, 1, 1, 1, 6),
  (43, "The NeverEnding Story", 8, 280, 430, 90, 140, 1, 1, 1, 6),

  (44, "The Shining", 8, 140, 610, 70, 80, 1, 1, 1, 4),
  (45, "Say Anything", 8, 210, 610, 70, 80, 1, 1, 1, 4),
  (46, "Rear Window", 8, 140, 690, 140, 90, 1, 1, 1, 8),
  (47, "Jumanji", 8, 570, 610, 70, 80, 1, 1, 1, 4),
  (48, "Fargo", 8, 570, 690, 70, 90, 1, 1, 1, 4),

  (49, "Cocoon", 8, 00, 640, 100, 100, 1, 1, 1, 6),

  (50, "Blazing Saddles", 3, 1400, 40, 100, 100, 1, 1, 1, 6),


  (51, "Trading Places", 9, 0, 40, 100, 100, 1, 1, 1, 8),
  (52, "Boiler Room", 9, 0, 140, 100, 100, 1, 1, 1, 8),
  (53, "Starsky and Hutch", 9, 0, 240, 100, 100, 1, 1, 1, 8),

  (54, "Little Miss Sunshine", 9, 130, 340, 200, 130, 1, 1, 1, 16),
  (55, "Zamba", 9, 600, 340, 400, 130, 1, 1, 1, 22),
  (56, "Louise", 9, 760, 40, 240, 150, 1, 1, 1, 16),
  (57, "Thelma", 9, 760, 190, 240, 150, 1, 1, 1, 16),
  (58, "Phone 1", 7, 360, 140, 90, 60, 0, 1, 0, 2),
  (59, "Phone 2", 7, 360, 200, 90, 60, 0, 1, 0, 2),
  (60, "Conference 1", 7, 360, 200, 90, 110, 1, 1, 1, 5),
  (61, "Conference 2", 7, 360, 310, 90, 110, 1, 1, 1, 5),
  (62, "Conference 3(Big)", 7, 360, 420, 90, 180, 1, 1, 1, 12);

INSERT INTO places (id, name, description, section_id, xpos, ypos, width, height) VALUES
  (1, "Secondary kitchen", "Where we eat", 2, 200, 80, 100, 180),
  (2, "Women's restroom", "Where baths eat", 2, 300, 80, 80, 180),
  (3, "Men's restroom", "Where baths eat", 2, 380, 80, 80, 180),
  (4, "Telco Closet", "Where phones eat", 2, 460, 80, 80, 100),
  (5, "Mother's Room", "", 2, 460, 180, 80, 80),
  (6, "Electrical", "", 2, 540, 90, 80, 90),
  (7, "Print/Copy", "", 2, 540, 180, 80, 80),

  (8, "Small Meetings", "", 2, 1120, 190, 100, 110),
  (9, "Workroom", "", 2, 1220, 90, 60, 100),
  (10, "Storage", "", 2, 1280, 90, 40, 100),
  (11, "Legal/Finance/HR Storage", "", 2, 1220, 190, 100, 210),

  (12, "Electrical", "", 2, 1450, 90, 100, 90),
  (13, "Print/Copy", "", 2, 1450, 180, 70, 90),
  (14, "Electrical", "", 2, 1520, 180, 30, 90),

  (15, "Loading dock", "", 8, 0, 0, 100, 100),
  (16, "Facilities storage", "", 8, 100, 0, 250, 100),
  (17, "Control room", "", 8, 390, 0, 150, 30),

  (18, "Zen room", "", 8, 0, 200, 100, 100),
  (19, "Empty room?", "", 8, 0, 340, 100, 80),

  (20, "Storage", "", 8, 290, 200, 50, 90),
  (21, "IT Storage", "", 8, 140, 290, 90, 140),
  (22, "Server Room", "", 8, 230, 290, 140, 140),
  (23, "Video Studio", "", 8, 140, 430, 140, 140),
  (24, "Women's restroom", "", 8, 370, 290, 90, 280),
  (25, "Men's restroom", "", 8, 460, 290, 90, 280),
  (26, "Electrical", "", 8, 550, 410, 90, 80),
  (27, "Mother's Room", "", 8, 550, 490, 90, 80),

  (28, "Empty room?", "", 8, 280, 610, 100, 170),
  (29, "Empty room?", "", 8, 380, 610, 100, 170),
  (30, "Empty room?", "", 8, 470, 610, 100, 170),

  (31, "Gym", "", 8, 730, 480, 270, 130),
  (32, "Game Room", "", 8, 730, 610, 270, 130),

  (33, "Coffee Bar", "", 9, 0, 340, 130, 130),
  (34, "Dallas Office Stairs", "",7, 0, 335, 250, 100),
  (35, "Kitchen Area", "",7, 250, 280, 80, 150),
  (36, "Reception","", 7, 250, 505, 80, 150)
  ;

INSERT INTO desk_groups (name, section_id, xpos, ypos) VALUES
  (NULL, 1, 110, 10),
  (NULL, 1, 110, 110),
  (NULL, 1, 200, 20),
  (NULL, 1, 200, 130),
  (NULL, 1, 260, 20),
  (NULL, 7, 30, 0),
  (NULL, 7, 130, 0),
  (NULL, 7, 235, 0),
  (NULL, 7, 330, 0),
  (NULL, 7, 30, 215),
  (NULL, 7, 150, 215);

INSERT INTO desks (name, desk_group_id, xpos, ypos, width, height, rotation) VALUES
  (NULL, 1, 0, 0, 20, 30, 0),
  (NULL, 1, 0, 30, 20, 30, 0),
  (NULL, 1, 0, 60, 20, 30, 0),
  (NULL, 1, 20, 0, 20, 30, 0),
  (NULL, 1, 20, 30, 20, 30, 0),
  (NULL, 1, 20, 60, 20, 30, 0),
  (NULL, 2, 0, 0, 20, 30, 0),
  (NULL, 2, 0, 30, 20, 30, 0),
  (NULL, 2, 0, 60, 20, 30, 0),
  (NULL, 2, 20, 0, 20, 30, 0),
  (NULL, 2, 20, 30, 20, 30, 0),
  (NULL, 2, 20, 60, 20, 30, 0),
  (NULL, 3, 0, 0, 20, 30, 0),
  (NULL, 3, 0, 30, 20, 30, 0),
  (NULL, 3, 0, 60, 20, 30, 0),
  (NULL, 3, 20, 0, 20, 30, 0),
  (NULL, 3, 20, 30, 20, 30, 0),
  (NULL, 3, 20, 60, 20, 30, 0),
  (NULL, 4, 0, 0, 20, 30, 0),
  (NULL, 4, 0, 30, 20, 30, 0),
  (NULL, 4, 0, 60, 20, 30, 0),
  (NULL, 4, 0, 90, 20, 30, 0),
  (NULL, 4, 0, 120, 20, 30, 0),
  (NULL, 4, 0, 150, 20, 30, 0),
  (NULL, 4, 20, 0, 20, 30, 0),
  (NULL, 4, 20, 30, 20, 30, 0),
  (NULL, 4, 20, 60, 20, 30, 0),
  (NULL, 4, 20, 90, 20, 30, 0),
  (NULL, 4, 20, 120, 20, 30, 0),
  (NULL, 4, 20, 150, 20, 30, 0),
  (NULL, 5, 0, 0, 20, 30, 0),
  (NULL, 5, 0, 30, 20, 30, 0),
  (NULL, 5, 0, 60, 20, 30, 0),
  (NULL, 6, 0, 0, 20, 40, 0),
  (NULL, 6, 0, 40, 20, 40, 0),
  (NULL, 6, 0, 80, 20, 40, 0),
  (NULL, 6, 0, 120, 20, 40, 0),
  (NULL, 6, 20, 0, 20, 40, 0),
  (NULL, 6, 20, 40, 20, 40, 0),
  (NULL, 6, 20, 80, 20, 40, 0),
  (NULL, 6, 20, 120, 20, 40, 0),
  (NULL, 7, 0, 0, 20, 40, 0),
  (NULL, 7, 0, 40, 20, 40, 0),
  (NULL, 7, 0, 80, 20, 40, 0),
  (NULL, 7, 0, 120, 20, 40, 0),
  (NULL, 7, 20, 0, 20, 40, 0),
  (NULL, 7, 20, 40, 20, 40, 0),
  (NULL, 7, 20, 80, 20, 40, 0),
  (NULL, 7, 20, 120, 20, 40, 0),
  (NULL, 8, 0, 0, 20, 40, 0),
  (NULL, 8, 0, 40, 20, 40, 0),
  (NULL, 8, 0, 80, 20, 40, 0),
  (NULL, 8, 20, 0, 20, 40, 0),
  (NULL, 8, 20, 40, 20, 40, 0),
  (NULL, 8, 20, 80, 20, 40, 0),
  (NULL, 9, 0, 0, 20, 40, 0),
  (NULL, 9, 0, 40, 20, 40, 0),
  (NULL, 9, 20, 0, 20, 40, 0),
  (NULL, 9, 20, 40, 20, 40, 0),
  (NULL, 10, 0, 0, 20, 40, 0),
  (NULL, 10, 0, 40, 20, 40, 0),
  (NULL, 10, 0, 80, 20, 40, 0),
  (NULL, 10, 20, 0, 20, 40, 0),
  (NULL, 10, 20, 40, 20, 40, 0),
  (NULL, 10, 20, 80, 20, 40, 0),
  (NULL, 11, 0, 0, 20, 30, 0),
  (NULL, 11, 0, 30, 20, 30, 0),
  (NULL, 11, 0, 60, 20, 30, 0),
  ("Cool", 500, 0, 0, 60, 20, 1),
  ("Cooler", 500, 0, 60, 60, 20, 1),

  ("Nice HR", 500, 0, 60, 20, 0, 0),
  ( "Mean HR", 500, 20, 60, 20, 0, 0),

  ( "Janky lonely small desk", 500, 0, 0, 50, 15, 0),

  ( "Big Texas Desk", 500, 0, 0, 90, 30, 0);