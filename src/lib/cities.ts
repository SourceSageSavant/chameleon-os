// City database for programmatic SEO pages
// Format: state -> cities mapping with population data

export interface City {
    name: string;
    state: string;
    slug: string;
    population?: number;
}

export const US_CITIES: City[] = [
    // California
    { name: 'Los Angeles', state: 'CA', slug: 'los-angeles', population: 3898747 },
    { name: 'San Diego', state: 'CA', slug: 'san-diego', population: 1386932 },
    { name: 'San Jose', state: 'CA', slug: 'san-jose', population: 1013240 },
    { name: 'San Francisco', state: 'CA', slug: 'san-francisco', population: 873965 },
    { name: 'Fresno', state: 'CA', slug: 'fresno', population: 542107 },
    { name: 'Sacramento', state: 'CA', slug: 'sacramento', population: 524943 },
    { name: 'Long Beach', state: 'CA', slug: 'long-beach', population: 466742 },
    { name: 'Oakland', state: 'CA', slug: 'oakland', population: 433031 },
    { name: 'Bakersfield', state: 'CA', slug: 'bakersfield', population: 403455 },
    { name: 'Anaheim', state: 'CA', slug: 'anaheim', population: 350365 },

    // Texas
    { name: 'Houston', state: 'TX', slug: 'houston', population: 2304580 },
    { name: 'San Antonio', state: 'TX', slug: 'san-antonio', population: 1547253 },
    { name: 'Dallas', state: 'TX', slug: 'dallas', population: 1304379 },
    { name: 'Austin', state: 'TX', slug: 'austin', population: 978908 },
    { name: 'Fort Worth', state: 'TX', slug: 'fort-worth', population: 918915 },
    { name: 'El Paso', state: 'TX', slug: 'el-paso', population: 678815 },
    { name: 'Arlington', state: 'TX', slug: 'arlington', population: 398854 },
    { name: 'Corpus Christi', state: 'TX', slug: 'corpus-christi', population: 317863 },
    { name: 'Plano', state: 'TX', slug: 'plano', population: 287677 },
    { name: 'Laredo', state: 'TX', slug: 'laredo', population: 260654 },

    // Florida
    { name: 'Jacksonville', state: 'FL', slug: 'jacksonville', population: 911507 },
    { name: 'Miami', state: 'FL', slug: 'miami', population: 467963 },
    { name: 'Tampa', state: 'FL', slug: 'tampa', population: 399700 },
    { name: 'Orlando', state: 'FL', slug: 'orlando', population: 307573 },
    { name: 'St. Petersburg', state: 'FL', slug: 'st-petersburg', population: 265351 },
    { name: 'Hialeah', state: 'FL', slug: 'hialeah', population: 233339 },
    { name: 'Port St. Lucie', state: 'FL', slug: 'port-st-lucie', population: 204851 },
    { name: 'Cape Coral', state: 'FL', slug: 'cape-coral', population: 194016 },
    { name: 'Tallahassee', state: 'FL', slug: 'tallahassee', population: 196169 },
    { name: 'Fort Lauderdale', state: 'FL', slug: 'fort-lauderdale', population: 182595 },

    // New York
    { name: 'New York City', state: 'NY', slug: 'new-york', population: 8336817 },
    { name: 'Buffalo', state: 'NY', slug: 'buffalo', population: 278349 },
    { name: 'Rochester', state: 'NY', slug: 'rochester', population: 211328 },
    { name: 'Yonkers', state: 'NY', slug: 'yonkers', population: 199766 },
    { name: 'Syracuse', state: 'NY', slug: 'syracuse', population: 148620 },

    // Illinois
    { name: 'Chicago', state: 'IL', slug: 'chicago', population: 2746388 },
    { name: 'Aurora', state: 'IL', slug: 'aurora', population: 200965 },
    { name: 'Naperville', state: 'IL', slug: 'naperville', population: 148449 },
    { name: 'Joliet', state: 'IL', slug: 'joliet', population: 150362 },
    { name: 'Rockford', state: 'IL', slug: 'rockford', population: 148655 },

    // Pennsylvania
    { name: 'Philadelphia', state: 'PA', slug: 'philadelphia', population: 1584064 },
    { name: 'Pittsburgh', state: 'PA', slug: 'pittsburgh', population: 302971 },
    { name: 'Allentown', state: 'PA', slug: 'allentown', population: 126092 },

    // Arizona
    { name: 'Phoenix', state: 'AZ', slug: 'phoenix', population: 1660272 },
    { name: 'Tucson', state: 'AZ', slug: 'tucson', population: 548073 },
    { name: 'Mesa', state: 'AZ', slug: 'mesa', population: 518012 },
    { name: 'Chandler', state: 'AZ', slug: 'chandler', population: 275987 },
    { name: 'Scottsdale', state: 'AZ', slug: 'scottsdale', population: 258069 },

    // Ohio
    { name: 'Columbus', state: 'OH', slug: 'columbus', population: 905748 },
    { name: 'Cleveland', state: 'OH', slug: 'cleveland', population: 381009 },
    { name: 'Cincinnati', state: 'OH', slug: 'cincinnati', population: 309317 },
    { name: 'Toledo', state: 'OH', slug: 'toledo', population: 274975 },
    { name: 'Akron', state: 'OH', slug: 'akron', population: 190469 },

    // Georgia
    { name: 'Atlanta', state: 'GA', slug: 'atlanta', population: 498715 },
    { name: 'Augusta', state: 'GA', slug: 'augusta', population: 202081 },
    { name: 'Savannah', state: 'GA', slug: 'savannah', population: 147780 },

    // North Carolina
    { name: 'Charlotte', state: 'NC', slug: 'charlotte', population: 885708 },
    { name: 'Raleigh', state: 'NC', slug: 'raleigh', population: 474069 },
    { name: 'Greensboro', state: 'NC', slug: 'greensboro', population: 299035 },
    { name: 'Durham', state: 'NC', slug: 'durham', population: 283506 },

    // Michigan
    { name: 'Detroit', state: 'MI', slug: 'detroit', population: 639111 },
    { name: 'Grand Rapids', state: 'MI', slug: 'grand-rapids', population: 202751 },
    { name: 'Warren', state: 'MI', slug: 'warren', population: 139090 },

    // Washington
    { name: 'Seattle', state: 'WA', slug: 'seattle', population: 753675 },
    { name: 'Spokane', state: 'WA', slug: 'spokane', population: 229071 },
    { name: 'Tacoma', state: 'WA', slug: 'tacoma', population: 219346 },

    // Colorado
    { name: 'Denver', state: 'CO', slug: 'denver', population: 727211 },
    { name: 'Colorado Springs', state: 'CO', slug: 'colorado-springs', population: 478961 },
    { name: 'Aurora', state: 'CO', slug: 'aurora-co', population: 386261 },

    // Massachusetts
    { name: 'Boston', state: 'MA', slug: 'boston', population: 692600 },
    { name: 'Worcester', state: 'MA', slug: 'worcester', population: 206518 },

    // Tennessee
    { name: 'Nashville', state: 'TN', slug: 'nashville', population: 689447 },
    { name: 'Memphis', state: 'TN', slug: 'memphis', population: 633104 },
    { name: 'Knoxville', state: 'TN', slug: 'knoxville', population: 190740 },

    // Maryland
    { name: 'Baltimore', state: 'MD', slug: 'baltimore', population: 585708 },

    // Wisconsin
    { name: 'Milwaukee', state: 'WI', slug: 'milwaukee', population: 577222 },
    { name: 'Madison', state: 'WI', slug: 'madison', population: 269840 },

    // Oregon
    { name: 'Portland', state: 'OR', slug: 'portland', population: 654741 },
    { name: 'Salem', state: 'OR', slug: 'salem', population: 177723 },
    { name: 'Eugene', state: 'OR', slug: 'eugene', population: 176654 },

    // Nevada
    { name: 'Las Vegas', state: 'NV', slug: 'las-vegas', population: 651319 },
    { name: 'Henderson', state: 'NV', slug: 'henderson', population: 320189 },
    { name: 'Reno', state: 'NV', slug: 'reno', population: 264165 },

    // Oklahoma
    { name: 'Oklahoma City', state: 'OK', slug: 'oklahoma-city', population: 681054 },
    { name: 'Tulsa', state: 'OK', slug: 'tulsa', population: 401190 },

    // Kentucky
    { name: 'Louisville', state: 'KY', slug: 'louisville', population: 617638 },
    { name: 'Lexington', state: 'KY', slug: 'lexington', population: 323780 },

    // Indiana
    { name: 'Indianapolis', state: 'IN', slug: 'indianapolis', population: 887642 },
    { name: 'Fort Wayne', state: 'IN', slug: 'fort-wayne', population: 268378 },

    // Missouri
    { name: 'Kansas City', state: 'MO', slug: 'kansas-city', population: 508090 },
    { name: 'St. Louis', state: 'MO', slug: 'st-louis', population: 301578 },

    // Minnesota
    { name: 'Minneapolis', state: 'MN', slug: 'minneapolis', population: 429954 },
    { name: 'St. Paul', state: 'MN', slug: 'st-paul', population: 311527 },

    // Louisiana
    { name: 'New Orleans', state: 'LA', slug: 'new-orleans', population: 390144 },
    { name: 'Baton Rouge', state: 'LA', slug: 'baton-rouge', population: 227549 },

    // Virginia
    { name: 'Virginia Beach', state: 'VA', slug: 'virginia-beach', population: 449974 },
    { name: 'Norfolk', state: 'VA', slug: 'norfolk', population: 244076 },
    { name: 'Richmond', state: 'VA', slug: 'richmond', population: 230436 },

    // Alabama
    { name: 'Birmingham', state: 'AL', slug: 'birmingham', population: 200733 },
    { name: 'Montgomery', state: 'AL', slug: 'montgomery', population: 200022 },
    { name: 'Huntsville', state: 'AL', slug: 'huntsville', population: 215006 },

    // South Carolina
    { name: 'Charleston', state: 'SC', slug: 'charleston', population: 150227 },
    { name: 'Columbia', state: 'SC', slug: 'columbia', population: 131674 },

    // New Jersey
    { name: 'Newark', state: 'NJ', slug: 'newark', population: 282011 },
    { name: 'Jersey City', state: 'NJ', slug: 'jersey-city', population: 292449 },

    // Utah
    { name: 'Salt Lake City', state: 'UT', slug: 'salt-lake-city', population: 200567 },
    { name: 'West Valley City', state: 'UT', slug: 'west-valley-city', population: 140230 },

    // Hawaii
    { name: 'Honolulu', state: 'HI', slug: 'honolulu', population: 350964 },

    // Alaska
    { name: 'Anchorage', state: 'AK', slug: 'anchorage', population: 291247 },
];

export function getCityBySlug(slug: string): City | undefined {
    return US_CITIES.find(city => city.slug === slug);
}

export function getCitiesByState(state: string): City[] {
    return US_CITIES.filter(city => city.state === state);
}

export function getAllCitySlugs(): string[] {
    return US_CITIES.map(city => city.slug);
}

export function getTopCities(count: number = 100): City[] {
    return [...US_CITIES]
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, count);
}
