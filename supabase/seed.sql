-- ==============================================================================
-- BDYatra: Initial Database Seed Data (Bangladesh Travel Discovery)
-- ==============================================================================

-- 1. SEED DIVISIONS
INSERT INTO divisions (id, name, tagline, description, cover_image) VALUES
('chittagong', 'Chittagong', 'Hills, Valleys & 120km Coastline', 'Southeastern gateway home to Cox’s Bazar beach, Sajek Valley cloud ridges, and indigenous hill sanctuaries.', '/src/assets/images/coxs_bazar_shore_1793169489630.jpg'),
('sylhet', 'Sylhet', 'Tea Estates, Rain Forests & Endless Haors', 'Northeastern paradise known as the tea capital of Bangladesh, featuring Lawachara National Park and Tanguar Haor.', '/src/assets/images/srimangal_tea_hills_1793169489776.jpg'),
('khulna', 'Khulna', 'World’s Largest Mangrove Delta', 'Southwestern delta territory home to the UNESCO World Heritage Sundarbans mangrove forest and Royal Bengal Tigers.', '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg'),
('barishal', 'Barishal', 'The Venice of Bengal & Floating Markets', 'Southern riverine network known for tranquil backwaters, floating guava markets, and Kuakata panoramic beach.', '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg'),
('dhaka', 'Dhaka', 'Historic Delta Capital & Heritage Trails', 'Central division brimming with Mughal forts, ancient merchant quarters of Panam Nagar, and artisan Jamdani villages.', '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg'),
('rajshahi', 'Rajshahi', 'Silk City & Ancient Buddhist Monasteries', 'Northwestern historical cradle along the Padma River, featuring 8th-century Somapura Mahavihara at Paharpur.', '/src/assets/images/srimangal_tea_hills_1793169489776.jpg'),
('rangpur', 'Rangpur', 'Northern Palaces & Teesta River Vistas', 'Northern agricultural heartland with Tajhat Palace and serene Himalayan foothills atmosphere.', '/src/assets/images/srimangal_tea_hills_1793169489776.jpg'),
('mymensingh', 'Mymensingh', 'Garo Hills & Riverine Heritage', 'Scenic border district flanking the Garo Hills, Shusong Durgapur white ceramic clay hills, and Brahmaputra riverbanks.', '/src/assets/images/sajek_valley_clouds_1793169490136.jpg')
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
tagline = EXCLUDED.tagline,
description = EXCLUDED.description;

-- 2. SEED DISTRICTS
INSERT INTO districts (id, division_id, name, popular_for) VALUES
('coxs-bazar', 'chittagong', 'Cox’s Bazar', 'World’s longest continuous sea beach, Marine Drive, and Inani coral shore.'),
('rangamati', 'chittagong', 'Rangamati', 'Kaptai Lake, indigenous Chakma crafts, and Sajek Valley cloud peaks.'),
('bandarban', 'chittagong', 'Bandarban', 'Highest mountain ridges, Nilgiri, Boga Lake, and mountain waterfalls.'),
('moulvibazar', 'sylhet', 'Moulvibazar', 'Sreemangal tea estates, Lawachara rain forest, and Seven-Layer Tea.'),
('sunamganj', 'sylhet', 'Sunamganj', 'Tanguar Haor wetland, living luxury houseboats, and Jadukata River.'),
('bagerhat', 'khulna', 'Bagerhat', 'Sundarbans mangrove entry port and Sixty Dome UNESCO Mosque.'),
('patuakhali', 'barishal', 'Patuakhali', 'Kuakata panoramic beach with dual sunrise and sunset.'),
('narayanganj', 'dhaka', 'Narayanganj', 'Panam Nagar 19th-century merchant ghost city and Sonargaon Folk Art.'),
('naogaon', 'rajshahi', 'Naogaon', 'Somapura Mahavihara 8th-century Buddhist UNESCO monastery.')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED DESTINATIONS
INSERT INTO destinations (
    id, title, slug, tagline, description, division_id, district_id, category,
    cover_image, highlights, best_season, estimated_budget, recommended_days,
    rating, review_count, how_to_reach, is_featured, is_published
) VALUES
(
    'sundarbans-delta',
    'Sundarbans Mangrove Forest',
    'sundarbans-mangrove-forest',
    'World’s Largest Tidal Mangrove & Royal Bengal Tiger Habitat',
    'A vast UNESCO World Heritage delta shared between rivers and the sea. Navigate labyrinthine brackish water channels, dense sundari tree canopies, and observe spotted deer, saltwater crocodiles, and the elusive Royal Bengal Tiger.',
    'khulna',
    'bagerhat',
    'Nature & Wildlife',
    '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    ARRAY['Kotka Wildlife Sanctuary & Watchtower', 'Silent canal cruising on traditional wooden dinghy', 'Karamjal Crocodile & Deer Breeding Center', 'UNESCO Mangrove Biosphere Trails'],
    'November to February (Cooler & Calm Rivers)',
    '$75 - $160 / day',
    3,
    4.9,
    342,
    'Fly or train to Jessore / Khulna, then embark on a licensed tourism cruiser departing from Mongla Port.',
    TRUE,
    TRUE
),
(
    'coxs-bazar-coast',
    'Cox''s Bazar & Marine Drive',
    'coxs-bazar-marine-drive',
    'World’s Longest Natural Unbroken Sea Beach (120 Kilometers)',
    'Spanning 120 continuous kilometers along the Bay of Bengal, flanked on one side by lush green hills and on the other by rolling surf. Experience the scenic Marine Drive, sunset at Inani Coral Beach, and fresh seafood.',
    'chittagong',
    'coxs-bazar',
    'Beaches & Islands',
    '/src/assets/images/coxs_bazar_shore_1793169489630.jpg',
    ARRAY['80 km scenic Marine Drive coastal highway', 'Inani Beach with natural coral stone formations', 'Himchari National Park waterfall & hill outlook', 'Sunrise over Kolatoli and dusk at Laboni Point'],
    'October to April (Sunny & Mild Waves)',
    '$50 - $130 / day',
    3,
    4.8,
    680,
    'Direct flights daily from Dhaka to Cox’s Bazar Airport (CXB), or express luxury train from Dhaka Kamalapur.',
    TRUE,
    TRUE
),
(
    'sreemangal-tea-country',
    'Sreemangal Tea Country',
    'sreemangal-tea-country',
    'Tea Capital of Bangladesh & Ancient Rain Forest',
    'Rolling carpet of manicured green tea hills stretching across tranquil valleys. Home to Lawachara National Park where the endangered Western Hoolock Gibbon calls from high tree canopies, and organic pineapple orchards.',
    'sylhet',
    'moulvibazar',
    'Tea Country',
    '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    ARRAY['Seven-layer tea tasting experience', 'Lawachara Rain Forest canopy nature trek', 'Cycling through historic British-era tea estates', 'Baikka Beel bird sanctuary wetland tower'],
    'July to February (Plush Monsoon Greenery or Crisp Winter)',
    '$45 - $110 / day',
    2,
    4.9,
    429,
    'Parabat Express or Kalni Express train from Dhaka to Sreemangal station (approx. 4.5 hours).',
    TRUE,
    TRUE
),
(
    'sajek-valley-clouds',
    'Sajek Valley & Cloud Ridge',
    'sajek-valley-cloud-ridge',
    'The Queen of Hills Above the Sea of Clouds',
    'Perched at 1,800 feet above sea level in the Chittagong Hill Tracts, Sajek offers panoramic views of rolling clouds below timber cottages, starry night skies, and scenic Chander Gari jeep rides along mountain switchbacks.',
    'chittagong',
    'rangamati',
    'Hill Tracts',
    '/src/assets/images/sajek_valley_clouds_1793169490136.jpg',
    ARRAY['Konglak Para: highest peak point in Sajek', 'Open-air Chander Gari 4x4 mountain safari', 'Sunrise above fluffy cloud blankets from private balcony', 'Indigenous bamboo chicken culinary specialty'],
    'September to March (Cloud oceans in autumn, clear winter peaks)',
    '$55 - $120 / day',
    2,
    4.9,
    512,
    'Travel from Dhaka to Khagrachari by highway bus, followed by army-escorted Chander Gari 4x4 up the mountain ridge.',
    TRUE,
    TRUE
),
(
    'tanguar-haor-wetlands',
    'Tanguar Haor Wetland & Houseboats',
    'tanguar-haor-wetlands',
    'UNESCO Ramsar Wetland with Premium Living Houseboats',
    'A unique inland wetland ecosystem spanning over 100 square kilometers beneath the Meghalaya hill foothills. During monsoon, it transforms into an endless freshwater ocean traversed by luxury wooden living houseboats.',
    'sylhet',
    'sunamganj',
    'Wetlands & Haor',
    '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    ARRAY['Overnight stay on handcrafted wooden living houseboat', 'Jadukata River transparent crystal water & Barek Tila ridge', 'Shimul Bagan silk cotton tree garden blooming red', 'Thousands of migratory birds from Siberia in winter'],
    'June to October (Monsoon Haor Waters) & Dec to Feb (Migratory Birds)',
    '$60 - $140 / day',
    2,
    4.8,
    310,
    'Bus or train to Sylhet, road transfer to Sunamganj Tahirpur ghat to board private houseboats.',
    FALSE,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description;

-- 4. SEED DIRECTORY: HOTELS, RESORTS & RESTAURANTS
INSERT INTO directory_places (
    id, name, place_type, division_id, district_id, destination_id,
    description, price_range, price_rate, rating, review_count, is_verified,
    phone, email, website, address, amenities, is_featured, is_published
) VALUES
(
    'dusai-resort-spa',
    'Dusai Resort & Nature Spa',
    'resort',
    'sylhet',
    'moulvibazar',
    'sreemangal-tea-country',
    'Premier 5-star boutique villa retreat terraced on natural hillocks surrounded by tea estates and rubber plantations. Features infinity pool, tea garden trekking, and private luxury cottages.',
    '$$$$',
    '$140 - $280 / night',
    4.9,
    215,
    TRUE,
    '+880 1617 005522',
    'reservations@dusairesort.com',
    'https://dusairesort.com',
    'Nateshwar, Sreemangal Road, Moulvibazar',
    ARRAY['Infinity Pool & Ayurvedic Spa', 'Tea Garden Private Walks', 'Fine Dining Multi-Cuisine', 'Electric Cart Estate Tours'],
    TRUE,
    TRUE
),
(
    'mermaid-eco-resort',
    'Mermaid Eco Resort & Beach Cabins',
    'resort',
    'chittagong',
    'coxs-bazar',
    'coxs-bazar-coast',
    'Eco-conscious beachfront resort with thatched-roof bamboo suites on Marine Drive. Organic culinary kitchen, secluded private access to Pecharthal beach, and open-air sunset lounges.',
    '$$$',
    '$90 - $180 / night',
    4.8,
    380,
    TRUE,
    '+880 1841 416464',
    'info@mermaidecoresort.com',
    'https://mermaidecoresort.com',
    'Marine Drive Road, Pecharthal, Cox’s Bazar',
    ARRAY['Direct Private Beachfront', 'Organic Farm-to-Table Dining', 'Kayaking & Marine Excursions', 'Yoga & Meditation Decks'],
    TRUE,
    TRUE
),
(
    'tanguar-shwapnotori-houseboat',
    'Shwapnotori Premium Living Houseboat',
    'houseboat',
    'sylhet',
    'sunamganj',
    'tanguar-haor-wetlands',
    'Handcrafted seasoned timber houseboat with air-conditioned ensuite cabins, upper observation sun deck, dedicated chef serving fresh haor duck and fish, and solar silent power generator.',
    '$$$',
    '$85 - $150 / guest / night',
    4.9,
    164,
    TRUE,
    '+880 1712 998877',
    'cruises@shwapnotori.com',
    NULL,
    'Tahirpur Ghat, Sunamganj, Sylhet',
    ARRAY['Ensuite AC Timber Cabins', 'Fresh Haor Chef Dining (5 Meals)', 'Life Jackets & Safety Escort', 'Jadukata River Stopovers'],
    TRUE,
    TRUE
),
(
    'bengal-wildlife-expeditions',
    'Bengal Sundarban Forest Expeditions',
    'guide',
    'khulna',
    'bagerhat',
    'sundarbans-delta',
    'Certified naturalist expedition team with 18+ years running eco-tours into deep Sundarbans tiger zones. Accompanied by armed forest guards and dedicated marine biologists.',
    '$$',
    '$180 - $320 / 3-day package',
    4.9,
    142,
    TRUE,
    '+880 1711 334455',
    'wildlife@bengalexpeditions.com',
    NULL,
    'Mongla Tourism Jetty, Bagerhat',
    ARRAY['Government Licensed Naturalists', 'Silent Electric Dinghy for Canals', 'High-Power Spotting Optics', 'Forest Department Entry Permits'],
    TRUE,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description;

-- 5. SEED TRAVEL BLOGS & EDITORIAL GUIDES
INSERT INTO blogs (
    id, title, slug, excerpt, content, author_name, cover_image, tags,
    reading_time, destination_id, division_id, is_featured, is_published, published_at
) VALUES
(
    'guide-first-time-sajek-cloud-valley',
    'The Complete Guide to Sajek Valley: Sleeping Above the Cloud Ocean',
    'complete-guide-sajek-valley-cloud-ocean',
    'Everything you need to know about navigating the army convoy from Khagrachari, securing cliff-edge timber cottages, and tasting indigenous bamboo culinary traditions.',
    'Perched atop the rugged ridges of the Chittagong Hill Tracts at an elevation of 1,800 feet, Sajek Valley has captivated travelers with its breathtaking morning cloud inversions. Unlike conventional mountain resorts, life in Sajek follows the rhythm of mountain winds and scheduled army-escorted Chander Gari convoys.\n\n### When to Visit for the Cloud Sea\nThe prime window for witnessing the unbroken white cloud blanket beneath your balcony is from September through November. As night temperatures cool and autumn humidity hovers over the Karnaphuli river valleys below, morning thermal inversions form thick seas of fog that burn off gradually by 9:00 AM.\n\n### Convoy Logistics & Permits\nAll vehicles entering Sajek must join the organized escort starting at Khagrachari town. The morning convoy departs promptly at 10:30 AM, while the afternoon departure leaves at 3:00 PM. Make sure your driver is registered with the local Chander Gari cooperative.\n\n### Where to Stay\nOpt for west-facing cottages in Ruilui Para for magnificent sunsets, or east-facing timber balconies for unobstructed sunrises over the hills into neighboring Mizoram.',
    'Travel Desk BDYatra',
    '/src/assets/images/sajek_valley_clouds_1793169490136.jpg',
    ARRAY['Hill Tracts', 'Sajek', 'Adventure', 'Photography'],
    '6 min read',
    'sajek-valley-clouds',
    'chittagong',
    TRUE,
    TRUE,
    NOW() - INTERVAL '3 days'
),
(
    'monsoon-houseboat-cruising-tanguar-haor',
    'Monsoon Inland Oceans: Life Aboard a Living Houseboat on Tanguar Haor',
    'monsoon-houseboat-cruising-tanguar-haor',
    'Discover why monsoon season transforms Sunamganj into the most enchanting freshwater expanse in South Asia.',
    'During the peak monsoon months of July through September, the low-lying plains of Tahirpur and Sunamganj transform into an immense inland sea. The backdrop of the emerald Meghalaya plateau rising vertically across the border creates one of the most surreal landscapes on the subcontinent.\n\nModern living houseboats—crafted by local master shipwrights using native timber—now provide air-conditioned staterooms, expansive observation roofs, and authentic five-meal dining experiences highlighting haor duck curry and freshwater sweetfish.\n\nCruising from Tahirpur ghat through the Jadukata river allows you to swim in transparent turquoise mountain runoff and stroll along the white sands of Barek Tila.',
    'Nazmul Haque',
    '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    ARRAY['Wetlands', 'Sylhet', 'Houseboats', 'Eco-Tourism'],
    '5 min read',
    'tanguar-haor-wetlands',
    'sylhet',
    TRUE,
    TRUE,
    NOW() - INTERVAL '7 days'
),
(
    'cycling-sreemangal-tea-estates-lawachara',
    'Cycling Through Tea Estates & Rainforest Canopies in Sreemangal',
    'cycling-sreemangal-tea-estates-lawachara',
    'A quiet 48-hour itinerary pedaling along century-old British tea gardens and tracking endangered hoolock gibbons.',
    'Sreemangal represents the tranquil soul of rural Bangladesh. With its gentle rolling topography and shaded secondary avenues, it is perhaps the finest cycling destination in the nation.\n\nBegin your day at dawn by pedaling into the Finlay Tea Estate, where morning mist hangs gently above thousands of meticulously trimmed tea bushes. By midday, make your way to Lawachara National Park for a guided canopy walk. Keep your ears tuned to the distinctive calling calls of the Western Hoolock Gibbon echoing through the fig trees.',
    'Elena Vance',
    '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    ARRAY['Tea Country', 'Cycling', 'Wildlife', 'Slow Travel'],
    '4 min read',
    'sreemangal-tea-country',
    'sylhet',
    FALSE,
    TRUE,
    NOW() - INTERVAL '12 days'
)
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
content = EXCLUDED.content;
