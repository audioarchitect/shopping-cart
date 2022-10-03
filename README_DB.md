CREATE TABLE cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  discount_id INTEGER
);

CREATE TABLE item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL
);

CREATE TABLE cart_item (
  cart_id INTEGER,
  item_id INTEGER,
  quantity INTEGER NOT NULL
);

CREATE TABLE discount (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  discountCents INTEGER,
  discountPercent REAL,
  minimumCents INTEGER,
  custom TEXT
);


INSERT INTO cart (description, discount_id) VALUES 
('No discount applied', null), 
('Dollar amount discount applied to all items', 1),
('Percentage discount applied to whole cart', 2),
('Dollar amount discount applied to all shoes', 6),
('Percentage discount applied to socks', 5),
('Buy 4 pairs of Nike shows, get one Nike shoes free', 3)
('Buy 1 pair of Nike shoes, get one free Nike socks', 4);


INSERT INTO cart (description, discount_id) VALUES 
('Buy 1 pair of Nike shoes, get one free Nike socks', 4);

INSERT INTO item (name, price_cents) VALUES 
('Nike shoes', 8500), 
('Converse shoes', 5000),
('Nike socks', 2500),
('Hanes socks', 1500);


INSERT INTO cart_item (cart_id, item_id, quantity) VALUES 
(1, 1, 1), 
(1, 2, 1),
(1, 3, 2),
(1, 4, 4),
(2, 1, 1), 
(2, 2, 1),
(2, 3, 2),
(2, 4, 4),
(3, 1, 1), 
(3, 2, 1),
(3, 3, 2),
(3, 4, 4),
(4, 1, 1), 
(4, 2, 1),
(4, 3, 2),
(4, 4, 4),
(5, 1, 1), 
(5, 2, 1),
(5, 3, 2),
(5, 4, 4),
(6, 1, 4), 
(6, 2, 1),
(6, 3, 2),
(6, 4, 4), 
(7, 1, 1), 
(7, 2, 1),
(7, 3, 2),
(7, 4, 4);

INSERT INTO discount (description, discountCents, discountPercent, minimumCents) VALUES 
('10 off order of over $50', 1000, null, 5000), 
('20% off your order', null, .20, null);

INSERT INTO discount (description, custom) VALUES
('Buy 3 pairs of Hanes socks, get one pair free', '{"triggerItems":[4],"triggerMinimum":4,"discountItems":[4],"discountMaximum":1,"discountPercent":1}')
('Buy 1 pair of Nike shoes, get one pair of Nike socks free','{"triggerItems":[1],"triggerMinimum":1,"discountItems":[3],"discountMaximum":1,"discountPercent":1}')
('Get 25% off all shoes', '{"triggerItems":[1,2],"discountItems":[1,2],"discountPercent":.25}'),
('Get $15 off sock purchase', '{"triggerItems":[3,4],"discountItems":[3,4],"discountCents":1500}');

