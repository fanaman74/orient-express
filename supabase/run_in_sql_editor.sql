-- Orient Express — Full schema + seed from actual menu
-- Paste into: https://supabase.com/dashboard/project/amoxnuuplhlzjxmkwtjv/sql/new

-- ============================================================
-- 1. DROP & RECREATE (safe re-run)
-- ============================================================
DROP TABLE IF EXISTS set_menus CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;

-- ============================================================
-- 2. SCHEMA
-- ============================================================
CREATE TABLE menu_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num             TEXT,
  section         TEXT NOT NULL,
  name_fr         TEXT NOT NULL,
  name_nl         TEXT,
  name_en         TEXT,
  spicy           BOOLEAN DEFAULT false,
  price           NUMERIC(6,2) NOT NULL DEFAULT 0,
  active          BOOLEAN DEFAULT true,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE set_menus (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL CHECK (type IN ('menu','fondue')),
  num             TEXT,
  name_fr         TEXT NOT NULL,
  name_nl         TEXT,
  name_en         TEXT,
  description_fr  TEXT,
  description_nl  TEXT,
  description_en  TEXT,
  price           NUMERIC(6,2) NOT NULL,
  min_people      INTEGER DEFAULT 1,
  max_people      INTEGER,
  active          BOOLEAN DEFAULT true,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_menus   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read menu_items"  ON menu_items  FOR SELECT USING (active = true);
CREATE POLICY "Public read set_menus"   ON set_menus   FOR SELECT USING (active = true);

-- ============================================================
-- 3. SET MENUS
-- ============================================================
INSERT INTO set_menus (type, num, name_fr, name_nl, name_en, description_fr, description_nl, description_en, price, min_people, max_people, display_order) VALUES

('menu','1',
 'Menu 1 — Pour 1 personne','Menu 1 — Voor 1 persoon','Menu 1 — For 1 person',
 'Croquette de soja + au choix: Porc à la sauce aigre-douce / Bœuf aux légumes variés / Poulet aux champignons Chinois',
 'Sojakroket + naar keuze: Varken in zoetzure saus / Rundvlees met gemengde groenten / Kip met Chinese champignons',
 'Soy croquette + choice of: Pork in sweet & sour sauce / Beef with mixed vegetables / Chicken with Chinese mushrooms',
 13.00, 1, 1, 10),

('menu','2',
 'Menu 2 — Pour 2 personnes','Menu 2 — Voor 2 personen','Menu 2 — For 2 persons',
 'Croquette de soja (x2) · Poulet aux légumes variés · Scampis à la sauce piquante · Riz sauté à la mode Cantonaise',
 'Sojakroket (x2) · Kip met gemengde groenten · Scampis in pikante saus · Kantonees gebakken rijst',
 'Soy croquette (x2) · Chicken with mixed veg · Spicy prawns · Cantonese fried rice',
 27.00, 2, 2, 20),

('menu','3',
 'Menu 3 — Pour 3 personnes','Menu 3 — Voor 3 personen','Menu 3 — For 3 persons',
 'Croquettes Vietnamiennes (x6) · Calamar à la sauce piquante · Bœuf aux champignons Chinois · Canard laqué · Lychees',
 'Vietnamees kroketten (x6) · Inktvis in pikante saus · Rund met Chinese champignons · Pekingeend · Lychees',
 'Vietnamese croquettes (x6) · Spicy squid · Beef with Chinese mushrooms · Peking duck · Lychees',
 48.00, 3, 3, 30),

('menu','4',
 'Menu 4 — Pour 4 personnes','Menu 4 — Voor 4 personen','Menu 4 — For 4 persons',
 'Croissants farcis aux crevettes (x8) · Porc à la sauce aigre-douce · Canard laqué à la sauce d''orange · Scampis à la façon Thaïlandaise · Poulet aux noix de cajou · Beignets de banane au miel et amandes',
 'Garnalen gevulde croissants (x8) · Varken in zoetzure saus · Pekingeend in sinaasappelsaus · Thaise scampis · Kip met cashewnoten · Bananenbeignets met honing en amandelen',
 'Shrimp-filled croissants (x8) · Sweet & sour pork · Peking duck in orange sauce · Thai-style prawns · Chicken cashew · Banana fritters with honey & almonds',
 62.00, 4, 4, 40),

('fondue','F',
 'Fondue Chinoise','Chinese Fondue','Chinese Hot Pot',
 'Poulet · Bœuf · Surimi · Pangasius · Calmar · Scampis · Wan-Tan · Chou Chinois · Cheveux d''ange. Bouillon au choix: Champignons Chinois ou Bouillon piquant. Sauces: Aigre-douce · Curry · Piquante. Appareil prêté (50€ caution). Réservation 24h à l''avance.',
 'Kip · Rundvlees · Surimi · Pangasius · Inktvis · Scampis · Wan-Tan · Chinese kool · Engelenhaar. Bouillon naar keuze: Chinese champignons of pikante bouillon. Sauzen: Zoetzuur · Curry · Pikant. Apparaat in bruikleen (50€ waarborg). Reservatie 24u op voorhand.',
 'Chicken · Beef · Surimi · Pangasius · Squid · Prawns · Wan-Tan · Chinese cabbage · Angel hair. Choice of broth: Chinese mushroom or spicy. Sauces: Sweet & sour · Curry · Spicy. Equipment on loan (€50 deposit). Book 24h in advance.',
 27.00, 2, NULL, 10);

-- ============================================================
-- 4. MENU ITEMS
-- ============================================================
INSERT INTO menu_items (num, section, display_order, name_fr, name_nl, name_en, spicy, price) VALUES

-- POTAGES
('1',  'potages', 10,  'Potage aigre-piquant',                          'Zuur-pittige soep',                                'Sour spicy soup',                          true,  4.50),
('2',  'potages', 20,  'Soupe Wan-Tan',                                  'Wan-Tan soep',                                     'Wan-Tan soup',                             false, 5.20),
('3',  'potages', 30,  'Potage de poulet aux tomates',                   'Kippensoep met tomaten',                           'Chicken tomato soup',                      false, 4.50),
('3a', 'potages', 35,  'Potage nid d''hirondelle',                       'Zwaluwnestsoep',                                   'Bird''s nest soup',                        false, 4.50),
('4',  'potages', 40,  'Soupe Champignons Chinois et cheveux d''ange',   'Chinese champignonsoep met engelenhaar',           'Chinese mushroom soup with angel hair',    false, 4.50),
('4a', 'potages', 45,  'Soupe végé',                                     'Groentesoep',                                      'Vegetable soup',                           false, 4.50),
('5',  'potages', 50,  'Soupe ravioli Chinois',                          'Chinese raviolisoep',                              'Chinese ravioli soup',                     false, 6.00),
('6',  'potages', 60,  'Soupe Wan-Tan et nouilles',                      'Wan-Tan soep met noedels',                         'Wan-Tan soup with noodles',                false, 7.50),
('7',  'potages', 70,  'Soupe ravioli Chinois et nouilles',              'Chinese ravioli soep met noedels',                 'Chinese ravioli soup with noodles',        false, 8.00),
('8',  'potages', 80,  'Potage fruits de mer et nouilles',               'Zeevruchtensoep met noedels',                      'Seafood soup with noodles',                false, 12.00),
('9',  'potages', 90,  'Soupe de poulet et nouilles',                    'Kippensoep met noedels',                           'Chicken soup with noodles',                false, 8.00),

-- HORS D'ŒUVRES
('10', 'entrees', 10,  'Chips de crevette',                             'Garnalenchips',                                    'Prawn crackers',                           false, 3.50),
('11', 'entrees', 20,  'Croquette de soja et poulet (x1)',              'Soja- en kippenkroket (x1)',                        'Soy and chicken croquette (x1)',           false, 3.50),
('12', 'entrees', 30,  'Croquettes Vietnamiennes / nems (x2)',          'Vietnamees kroketten / nems (x2)',                  'Vietnamese spring rolls / nems (x2)',      false, 4.50),
('13', 'entrees', 40,  'Croissants farcis aux crevettes (x3)',          'Garnalen gevulde croissants (x3)',                  'Shrimp-filled croissants (x3)',            false, 4.50),
('14', 'entrees', 50,  'Raviolis Chinois frits (x4)',                   'Chinese gefrituurde ravioli (x4)',                  'Fried Chinese ravioli (x4)',               false, 6.00),
('15', 'entrees', 60,  'Staté de porc (x2)',                            'Varkenssaté (x2)',                                  'Pork satay (x2)',                          false, 5.50),
('16', 'entrees', 70,  'Ailes de poulet farcies au porc (x2)',          'Varken gevulde kippenvleugels (x2)',                'Pork-stuffed chicken wings (x2)',          false, 8.50),
('17', 'entrees', 80,  'Beignets de scampis (x5)',                      'Scampibeignets (x5)',                               'Prawn fritters (x5)',                      false, 8.00),
('18', 'entrees', 90,  'Mini loempia végétarien (x6)',                  'Vegetarische mini loempia (x6)',                    'Vegetarian mini spring rolls (x6)',        false, 4.50),
('19', 'entrees', 100, 'Assortiment frits à l''Orient Express',         'Gebakken assortiment Orient Express',               'Orient Express mixed fried platter',       false, 8.50),
('20', 'entrees', 110, 'Bouchées de crevette à la vapeur (x4)',        'Gestoomde garnalenbouchées (x4)',                   'Steamed prawn dumplings (x4)',             false, 6.00),
('21', 'entrees', 120, 'Bouchées de porc à la vapeur (x4)',            'Gestoomde varkensbouchées (x4)',                    'Steamed pork dumplings (x4)',              false, 6.00),
('22', 'entrees', 130, 'Dim Sum chaud à la vapeur (x8)',                'Warme gestoomde Dim Sum (x8)',                      'Warm steamed Dim Sum (x8)',                false, 9.50),
('23', 'entrees', 140, 'Triangle au curry (x6)',                        'Curry driehoekjes (x6)',                            'Curry triangles (x6)',                     false, 5.00),
('24', 'entrees', 150, 'Saté de poulet',                               'Kippensaté',                                        'Chicken satay',                            false, 5.50),
('25', 'entrees', 160, 'Assortiment 7 entrées frits avec 3 sauces',    'Assortiment van 7 gebakken voorgerechten, 3 sauzen', 'Assortment of 7 fried starters, 3 sauces', false, 12.00),
('26', 'entrees', 170, 'Salade Chinoise avec poulet',                  'Chinese salade met kip',                            'Chinese salad with chicken',               false, 5.50),

-- POULET & CANARD
('27', 'poulet-canard', 10,  'Poulet aux oignons',                               'Kip met uien',                               'Chicken with onions',                        false, 10.00),
('28', 'poulet-canard', 20,  'Poulet à la sauce aigre-douce',                    'Kip in zoetzure saus',                        'Sweet & sour chicken',                       false, 9.50),
('29', 'poulet-canard', 30,  'Poulet aux légumes variés',                        'Kip met gemengde groenten',                   'Chicken with mixed vegetables',              false, 9.50),
('30', 'poulet-canard', 40,  'Poulet à la sauce aigre-piquante',                 'Kip in zuur-pikante saus',                    'Sour spicy chicken',                         true,  9.50),
('31', 'poulet-canard', 50,  'Poulet à la sauce piquante',                       'Kip in pikante saus',                         'Spicy chicken',                              true,  9.50),
('32', 'poulet-canard', 60,  'Poulet à l''ananas',                               'Kip met ananas',                              'Chicken with pineapple',                     false, 9.50),
('33', 'poulet-canard', 70,  'Poulet aux haricots noirs',                        'Kip met zwarte bonen',                        'Chicken with black beans',                   false, 9.50),
('34', 'poulet-canard', 80,  'Beignets de poulet sauce aigre-douce',             'Kippenbeignets in zoetzure saus',             'Chicken fritters in sweet & sour sauce',     false, 10.00),
('35', 'poulet-canard', 90,  'Poulet aux champignons Chinois',                   'Kip met Chinese champignons',                 'Chicken with Chinese mushrooms',             false, 10.50),
('36', 'poulet-canard', 100, 'Poulet aux noix de cajou',                         'Kip met cashewnoten',                         'Chicken with cashew nuts',                   false, 11.50),
('37', 'poulet-canard', 110, 'Poulet à la Thaïlandaise au basilic',              'Thaise kip met basilicum',                    'Thai chicken with basil',                    true,  11.00),
('38', 'poulet-canard', 120, 'Poulet à la crème de coco',                        'Kip in kokosroom',                            'Chicken in coconut cream',                   false, 10.50),
('39', 'poulet-canard', 130, 'Poulet au curry',                                  'Kip met curry',                               'Chicken curry',                              false, 9.50),
('40', 'poulet-canard', 140, 'Poulet à la crème de coco et curry',               'Kip met kokosroom en curry',                  'Chicken in coconut cream and curry',         false, 10.50),
('41', 'poulet-canard', 150, 'Poulet aigre-piquant à la façon Thaïlandaise',     'Zuur-pittige Thaise kip',                     'Thai-style sour spicy chicken',              true,  11.00),
('42', 'poulet-canard', 160, 'Canard simple',                                    'Eend naturel',                                'Duck',                                       false, 13.50),
('43', 'poulet-canard', 170, 'Canard aux champignons Chinois',                   'Eend met Chinese champignons',                'Duck with Chinese mushrooms',                false, 13.50),
('44', 'poulet-canard', 180, 'Canard aux ananas et gingembre',                   'Eend met ananas en gember',                   'Duck with pineapple and ginger',             true,  13.50),
('45', 'poulet-canard', 190, 'Canard aux ananas',                                'Eend met ananas',                             'Duck with pineapple',                        false, 13.50),
('46', 'poulet-canard', 200, 'Canard aux légumes variés',                        'Eend met gemengde groenten',                  'Duck with mixed vegetables',                 false, 13.50),
('47', 'poulet-canard', 210, 'Canard au miel et à la sauce orange',              'Eend met honing en sinaasappelsaus',          'Duck with honey and orange sauce',           false, 14.00),
('48', 'poulet-canard', 220, 'Canard à la façon de Pékin (avec crêpe)',          'Pekingeend (met pannenkoekje)',               'Peking duck (with pancake)',                 false, 14.00),
('49', 'poulet-canard', 230, 'Canard à la sauce piquante',                       'Eend in pikante saus',                        'Spicy duck',                                 true,  13.50),

-- PORC
('51', 'porc', 10,  'Porc à la sauce aigre-douce',                  'Varken in zoetzure saus',              'Sweet & sour pork',                          false, 10.00),
('52', 'porc', 20,  'Porc laqué à la sauce du miel',               'Gelakt varken in honingsaus',           'Honey glazed pork',                          false, 10.50),
('53', 'porc', 30,  'Babi Pangang — sauce aigre-piquante',          'Babi Pangang — zuur-pikante saus',     'Babi Pangang — sour spicy sauce',            true,  10.50),
('54', 'porc', 40,  'Spare-ribs à la sauce au miel',               'Spare-ribs in honingsaus',              'Honey spare ribs',                           false, 11.00),
('55', 'porc', 50,  'Porc laqué aux légumes variés',               'Gelakt varken met gemengde groenten',   'Glazed pork with mixed vegetables',          false, 10.50),
('56', 'porc', 60,  'Spare-ribs à la sauce piquante',              'Spare-ribs in pikante saus',            'Spicy spare ribs',                           true,  11.00),
('57', 'porc', 70,  'Plat de famille Chinoise (porc, bœuf, poulet, calamar)', 'Chinees familieschotel (varken, rund, kip, inktvis)', 'Chinese family dish (pork, beef, chicken, squid)', false, 12.00),

-- BŒUF
('58',  'boeuf', 10,  'Bœuf aux légumes variés',                    'Rund met gemengde groenten',           'Beef with mixed vegetables',                 false, 11.00),
('58a', 'boeuf', 15,  'Bœuf aux oignons',                           'Rund met uien',                        'Beef with onions',                           false, 11.00),
('59',  'boeuf', 20,  'Bœuf à la façon Si Chuan (piquant)',          'Sichuan rund (pikant)',                'Sichuan spicy beef',                         true,  11.00),
('59a', 'boeuf', 25,  'Bœuf aux noix de cajou',                     'Rund met cashewnoten',                 'Beef with cashew nuts',                      false, 13.00),
('60',  'boeuf', 30,  'Bœuf aux haricots noirs',                    'Rund met zwarte bonen',                'Beef with black beans',                      false, 11.00),
('60a', 'boeuf', 35,  'Bœuf à la Thaï au basilic',                  'Thais rund met basilicum',             'Thai beef with basil',                       true,  12.00),
('61',  'boeuf', 40,  'Bœuf aux champignons Chinois',               'Rund met Chinese champignons',         'Beef with Chinese mushrooms',                false, 11.00),
('61a', 'boeuf', 45,  'Bœuf à la sauce shacha (barbecue)',          'Rund in shacha saus (barbecue)',       'Beef in shacha sauce (barbecue)',            false, 11.00),
('62',  'boeuf', 50,  'Bœuf au curry',                              'Rund met curry',                       'Beef curry',                                 false, 11.00),
('63',  'boeuf', 60,  'Bœuf au curry à la façon Thaï (aigre-piquant)', 'Thaise curry rund (zuur-pikant)',  'Thai curry beef (sour spicy)',               true,  12.00),

-- POISSONS & FRUITS DE MER
('64',  'fruits-mer', 10,  'Scampis sautés aux légumes variés',           'Scampis gebakken met gemengde groenten',    'Sautéed prawns with mixed vegetables',       false, 13.00),
('65',  'fruits-mer', 20,  'Beignets de scampis à la sauce aigre-douce',  'Scampibeignets in zoetzure saus',           'Prawn fritters in sweet & sour sauce',       false, 13.50),
('66',  'fruits-mer', 30,  'Scampis façon Thaï (aigre-piquant)',          'Thaise scampis (zuur-pikant)',              'Thai-style prawns (sour spicy)',              true,  13.00),
('67',  'fruits-mer', 40,  'Scampis à la sauce piquante',                 'Scampis in pikante saus',                   'Spicy prawns',                               true,  13.00),
('67a', 'fruits-mer', 45,  'Scampis au curry',                            'Scampis met curry',                         'Prawn curry',                                false, 13.00),
('68',  'fruits-mer', 50,  'Scampis aux champignons Chinois',             'Scampis met Chinese champignons',           'Prawns with Chinese mushrooms',              false, 13.00),
('69',  'fruits-mer', 60,  'Scampis au beurre et à l''ail',              'Scampis in knoflookboter',                  'Garlic butter prawns',                       false, 13.00),
('69a', 'fruits-mer', 65,  'Scampis à la Thaïlandaise au basilic',       'Thaise scampis met basilicum',              'Thai prawns with basil',                     true,  13.50),
('70',  'fruits-mer', 70,  'Beignets de scampis à l''ail (piquant sec)',  'Knoflook scampibeignets (droog pikant)',    'Garlic prawn fritters (dry spicy)',          true,  14.00),
('71',  'fruits-mer', 80,  'Scampis à la sauce shacha (barbecue)',        'Scampis in shacha saus (barbecue)',         'Prawns in shacha sauce (barbecue)',          false, 13.00),
('72',  'fruits-mer', 90,  'Fruits de mer à la sauce piquante',           'Zeevruchten in pikante saus',               'Spicy mixed seafood',                        true,  14.50),
('73',  'fruits-mer', 100, 'Fruits de mer à la façon Thaïlandaise',      'Thaise zeevruchten',                        'Thai-style mixed seafood',                   true,  14.50),
('73a', 'fruits-mer', 105, 'Fruits de mer à la Thaï au basilic',         'Thaise zeevruchten met basilicum',          'Thai mixed seafood with basil',              true,  14.50),

-- CALAMARS
('74',  'calamars', 10,  'Calamars aux haricots noirs',                    'Inktvis met zwarte bonen',             'Squid with black beans',                     false, 11.00),
('74a', 'calamars', 15,  'Calamars à la Thaïlandaise au basilic',          'Thaise inktvis met basilicum',         'Thai squid with basil',                      true,  11.50),
('75',  'calamars', 20,  'Beignets de calamars frits à l''ail (piquant)',  'Knoflook inktvis beignets (pikant)',   'Garlic squid fritters (spicy)',              true,  12.00),
('76',  'calamars', 30,  'Beignets de calamars à la sauce aigre-douce',   'Inktvis beignets in zoetzure saus',    'Squid fritters in sweet & sour sauce',       false, 12.00),
('77',  'calamars', 40,  'Calamars sautés à la sauce piquante',           'Gebakken inktvis in pikante saus',     'Sautéed squid in spicy sauce',               true,  11.00),
('78',  'calamars', 50,  'Calamars au curry',                              'Inktvis met curry',                    'Squid curry',                                false, 11.00),
('79',  'calamars', 60,  'Calamars à la façon Thaïlandaise (aigre-piquant)', 'Thaise inktvis (zuur-pikant)',      'Thai-style squid (sour spicy)',               true,  11.50),

-- CUISSES DE GRENOUILLE & LOTTE
('80',  'grenouille-lotte', 10,  'Cuisses de grenouilles à la sauce basilic',      'Kikkerbouten met basilicumsaus',   'Frog legs with basil sauce',        false, 13.00),
('81',  'grenouille-lotte', 20,  'Cuisses de grenouilles à la sauce d''ail pimentée', 'Kikkerbouten met gekruide knoflooksaus', 'Frog legs with spicy garlic sauce', true, 13.00),
('82',  'grenouille-lotte', 30,  'Cuisses de grenouilles au beurre à l''ail',      'Kikkerbouten met knoflookboter',   'Frog legs in garlic butter',        false, 13.00),
('83',  'grenouille-lotte', 40,  'Cuisses de grenouilles à la sauce shacha',       'Kikkerbouten in shacha saus',      'Frog legs in shacha sauce',         false, 13.00),
('84',  'grenouille-lotte', 50,  'Lotte grillée au beurre',                         'Gegrilde zeeduivel in boter',      'Grilled monkfish in butter',        false, 14.50),
('84a', 'grenouille-lotte', 55,  'Lotte à la Thaïlandaise au basilic',              'Thaise zeeduivel met basilicum',   'Thai monkfish with basil',          true,  14.50),
('85',  'grenouille-lotte', 60,  'Lotte à la sauce shacha',                         'Zeeduivel in shacha saus',         'Monkfish in shacha sauce',          false, 14.50),
('86',  'grenouille-lotte', 70,  'Lotte à la sauce aigre-douce',                    'Zeeduivel in zoetzure saus',       'Monkfish in sweet & sour sauce',    false, 14.50),
('87',  'grenouille-lotte', 80,  'Lotte à la crème de coco',                        'Zeeduivel in kokosroom',           'Monkfish in coconut cream',         false, 14.50),
('87a', 'grenouille-lotte', 85,  'Lotte au curry',                                  'Zeeduivel met curry',              'Monkfish curry',                    false, 14.50),
('88',  'grenouille-lotte', 90,  'Lotte aigre-piquant à la façon Thaïlandaise',     'Zuur-pikante Thaise zeeduivel',    'Thai-style sour spicy monkfish',    true,  14.50),

-- PLATS VÉGÉTARIENS
('89',  'vegetarien', 10,  'Légumes variés avec sauce soja',             'Gemengde groenten met sojasaus',        'Mixed vegetables with soy sauce',        false, 9.00),
('89a', 'vegetarien', 15,  'Tofu sauté aux légumes',                     'Gebakken tofu met groenten',            'Sautéed tofu with vegetables',           false, 9.50),
('90',  'vegetarien', 20,  'Légumes variés à la crème de coco',          'Gemengde groenten met kokosroom',       'Mixed vegetables in coconut cream',      false, 10.00),
('91',  'vegetarien', 30,  'Légumes variés au coco et curry',            'Gemengde groenten met kokos en curry',  'Mixed vegetables with coconut & curry',  false, 10.00),
('92',  'vegetarien', 40,  'Soupe des légumes et nouilles',              'Groentesoep met noedels',               'Vegetable soup with noodles',            false, 8.00),
('93',  'vegetarien', 50,  'Riz sauté aux légumes variés',              'Gebakken rijst met gemengde groenten',  'Fried rice with mixed vegetables',       false, 9.00),
('94',  'vegetarien', 60,  'Nouilles ou pâtes sautées aux légumes variés','Noedels of pasta gebakken met groenten','Noodles or pasta stir-fried with veg',  false, 9.00),

-- NOUILLES & RIZ SAUTÉ
('95',  'riz-nouilles', 10,  'Nouilles ou pâtes sautées au poulet',         'Noedels of pasta gebakken met kip',          'Noodles or pasta stir-fried with chicken',    false, 10.50),
('96',  'riz-nouilles', 20,  'Nouilles ou pâtes sautées au bœuf',           'Noedels of pasta gebakken met rund',         'Noodles or pasta stir-fried with beef',       false, 11.50),
('97',  'riz-nouilles', 30,  'Nouilles ou pâtes sautées aux scampis',       'Noedels of pasta gebakken met scampis',      'Noodles or pasta stir-fried with prawns',     false, 12.50),
('98',  'riz-nouilles', 40,  'Nouilles ou pâtes sautées spéciales',         'Speciale noedels of pasta gebakken',         'Special stir-fried noodles or pasta',         false, 12.50),
('99',  'riz-nouilles', 50,  'Riz sauté au poulet',                         'Gebakken rijst met kip',                     'Fried rice with chicken',                     false, 9.50),
('100', 'riz-nouilles', 60,  'Riz sauté au poulet à la mode Thaïlandaise',  'Thais gebakken rijst met kip',               'Thai-style fried rice with chicken',          false, 9.50),
('101', 'riz-nouilles', 70,  'Riz sauté au bœuf',                           'Gebakken rijst met rund',                    'Fried rice with beef',                        false, 11.50),
('102', 'riz-nouilles', 80,  'Riz sauté aux scampis',                       'Gebakken rijst met scampis',                 'Fried rice with prawns',                      false, 12.50),
('103', 'riz-nouilles', 90,  'Riz sauté à la mode Cantonaise',              'Kantonees gebakken rijst',                   'Cantonese fried rice',                        false, 10.50),
('103a','riz-nouilles', 95,  'Riz sauté spécial',                           'Speciale gebakken rijst',                    'Special fried rice',                          false, 12.00),
('130', 'riz-nouilles', 100, 'Nouilles ou pâtes sautées au porc laqué',     'Noedels of pasta gebakken met gelakt varken','Noodles or pasta stir-fried with glazed pork',false, 10.50),
('131', 'riz-nouilles', 110, 'Riz sauté au porc laqué',                     'Gebakken rijst met gelakt varken',           'Fried rice with glazed pork',                 false, 9.50),
('132', 'riz-nouilles', 120, 'Riz sauté au canard',                         'Gebakken rijst met eend',                    'Fried rice with duck',                        false, 14.50),
('133', 'riz-nouilles', 130, 'Nouilles sautées au canard',                  'Gebakken noedels met eend',                  'Stir-fried noodles with duck',                false, 14.50),

-- SUPPLÉMENTAIRE
('104', 'supplements', 10, 'Nouilles sautées simples',    'Eenvoudige gebakken noedels',   'Plain stir-fried noodles',  false, 7.00),
('105', 'supplements', 20, 'Riz sauté simple',            'Eenvoudige gebakken rijst',     'Plain fried rice',          false, 7.00),
('106', 'supplements', 30, 'Riz blanc',                   'Witte rijst',                   'Steamed white rice',        false, 3.50),
('107', 'supplements', 40, 'Sauce curry',                 'Currysaus',                     'Curry sauce',               false, 2.50),
('108', 'supplements', 50, 'Sauce aigre-douce',           'Zoetzure saus',                 'Sweet & sour sauce',        false, 2.00),
('109a','supplements', 60, 'Sauce Pékinoise (sucrée)',    'Pekingse saus (zoet)',          'Peking sauce (sweet)',      false, 2.00),
('140', 'supplements', 70, 'Sauce aigre-piquante',        'Zuur-pikante saus',             'Sour spicy sauce',          true,  2.50),
('141', 'supplements', 80, 'Sauce soja',                  'Sojasaus',                      'Soy sauce',                 false, 1.00),
('142', 'supplements', 90, 'Sambal (piquant)',             'Sambal (pikant)',               'Sambal (spicy)',            true,  1.00),

-- DESSERTS
('109', 'desserts', 10, 'Beignets de bananes',                      'Bananenbeignets',                        'Banana fritters',                       false, 5.00),
('110', 'desserts', 20, 'Beignets de bananes au miel et amandes',   'Bananenbeignets met honing en amandelen','Banana fritters with honey & almonds',  false, 6.00),
('112', 'desserts', 30, 'Lychées (fruits)',                          'Lychees (fruit)',                        'Lychees (fruit)',                       false, 5.50);
