export const mockClients = [
  { id: 1, firstName: 'Sarah', surname: 'Okonkwo', postcode: 'SE15 4NB', yearOfBirth: 1989, totalVouchers: 4, lastIssued: 'Today', flag: 'repeat' },
  { id: 2, firstName: 'Marcus', surname: 'Thompson', postcode: 'SE5 8LX', yearOfBirth: 1975, totalVouchers: 2, lastIssued: '12 Apr', flag: 'normal' },
  { id: 3, firstName: 'Amara', surname: 'Kofi', postcode: 'SE1 7PQ', yearOfBirth: null, totalVouchers: 1, lastIssued: 'Today', flag: 'normal' },
  { id: 4, firstName: 'Fatima', surname: 'Lawal', postcode: 'SW9 0ER', yearOfBirth: 1993, totalVouchers: 3, lastIssued: '22 Apr', flag: 'review' },
  { id: 5, firstName: 'Peter', surname: 'Adeyemi', postcode: 'SE17 2BT', yearOfBirth: 1961, totalVouchers: 1, lastIssued: '10 Mar', flag: 'normal' },
  { id: 6, firstName: 'Grace', surname: 'Nwosu', postcode: 'SE4 1AB', yearOfBirth: 1987, totalVouchers: 2, lastIssued: '18 Apr', flag: 'normal' },
  { id: 7, firstName: 'James', surname: 'Obi', postcode: 'SW2 3CD', yearOfBirth: 1970, totalVouchers: 5, lastIssued: 'Yesterday', flag: 'repeat' },
]

export const mockVouchers = [
  { id: 1, ref: 'COG-2024-0247', client: 'Sarah Okonkwo', centre: 'Peckham', issuedBy: 'J. Adeyemi', date: 'Today 14:32', status: 'issued', type: 'repeat' },
  { id: 2, ref: 'COG-2024-0246', client: 'Marcus Thompson', centre: 'Peckham', issuedBy: 'J. Adeyemi', date: 'Today 13:18', status: 'fulfilled', type: 'standard' },
  { id: 3, ref: 'COG-2024-0245', client: 'Amara Kofi', centre: 'Brixton', issuedBy: 'D. Williams', date: 'Today 11:05', status: 'issued', type: 'standard' },
  { id: 4, ref: 'COG-2024-0244', client: 'Fatima Lawal', centre: 'Peckham', issuedBy: 'D. Williams', date: 'Yesterday', status: 'cancelled', type: 'standard' },
  { id: 5, ref: 'COG-2024-0243', client: 'Peter Adeyemi', centre: 'Brixton', issuedBy: 'T. Obi', date: 'Yesterday', status: 'fulfilled', type: 'standard' },
  { id: 6, ref: 'COG-2024-0242', client: 'Grace Nwosu', centre: 'Peckham', issuedBy: 'J. Adeyemi', date: '22 Apr', status: 'issued', type: 'standard' },
  { id: 7, ref: 'COG-2024-0241', client: 'James Obi', centre: 'Brixton', issuedBy: 'T. Obi', date: '22 Apr', status: 'fulfilled', type: 'repeat' },
]

export const mockAuditLog = [
  { id: 1, time: 'Today 14:47', action: 'Data export', detail: 'Vouchers report (CSV) exported — 247 records', user: 'J. Adeyemi', centre: 'Peckham Centre', type: 'export' },
  { id: 2, time: 'Today 14:32', action: 'Voucher issued', detail: 'COG-2024-0247 issued for Sarah Okonkwo — repeat flag acknowledged', user: 'J. Adeyemi', centre: 'Peckham Centre', type: 'voucher' },
  { id: 3, time: 'Today 14:30', action: 'Consent captured', detail: 'Dietary consent recorded for Sarah Okonkwo (halal, gluten free)', user: 'J. Adeyemi', centre: 'Peckham Centre', type: 'consent' },
  { id: 4, time: 'Today 13:18', action: 'Voucher fulfilled', detail: 'COG-2024-0246 marked as fulfilled', user: 'J. Adeyemi', centre: 'Peckham Centre', type: 'voucher' },
  { id: 5, time: 'Today 09:04', action: 'Login', detail: 'Staff session started', user: 'J. Adeyemi', centre: 'Peckham Centre', type: 'auth' },
  { id: 6, time: 'Yesterday 16:51', action: 'Voucher cancelled', detail: 'COG-2024-0244 cancelled — client did not attend', user: 'D. Williams', centre: 'Peckham Centre', type: 'voucher' },
  { id: 7, time: 'Yesterday 11:23', action: 'Client created', detail: 'New record: Fatima Lawal — SW9 0ER', user: 'D. Williams', centre: 'Peckham Centre', type: 'client' },
  { id: 8, time: 'Yesterday 08:59', action: 'Login', detail: 'Staff session started', user: 'D. Williams', centre: 'Peckham Centre', type: 'auth' },
]

export const mockStaff = [
  { id: 1, name: 'Jane Adeyemi', role: 'Centre Admin', centre: 'Peckham', status: 'active' },
  { id: 2, name: 'David Williams', role: 'Staff', centre: 'Peckham', status: 'active' },
  { id: 3, name: 'Tolu Obi', role: 'Volunteer', centre: 'Brixton', status: 'active' },
  { id: 4, name: 'Ngozi Anya', role: 'Read-only', centre: 'All centres', status: 'active' },
]

export const mockCentres = [
  { id: 1, name: 'Peckham Centre', address: '42 Peckham High St, SE15', delivery: true, staff: 2, openingTimes: 'Mon\u2013Fri 9am\u20134pm' },
  { id: 2, name: 'Brixton Centre', address: '18 Brixton Rd, SW9', delivery: false, staff: 1, openingTimes: 'Tue\u2013Thu 10am\u20133pm' },
]

export const mockDashboardStats = {
  vouchersThisMonth: 247,
  vouchersChange: '+12% vs last month',
  uniqueClients: 189,
  clientsChange: '+8 new this week',
  repeatVouchers: 58,
  repeatChange: '3 flagged today',
  collectionSplit: '74/26%',
  weeklyData: [
    { day: 'Mon', count: 28 },
    { day: 'Tue', count: 42 },
    { day: 'Wed', count: 35 },
    { day: 'Thu', count: 51 },
    { day: 'Fri', count: 61 },
    { day: 'Sat', count: 19 },
    { day: 'Sun', count: 11 },
  ],
  referralReasons: [
    { reason: 'Benefit delay', count: 72 },
    { reason: 'Low income', count: 61 },
    { reason: 'Debt crisis', count: 44 },
    { reason: 'Homeless', count: 28 },
    { reason: 'Refused benefits', count: 18 },
  ],
}

export const incomeOptions = [
  'Universal Credit',
  'Employment & Support Allowance',
  'Employed (low income)',
  'No income',
  'State Pension',
  'Other benefits',
]

export const referralOptions = [
  'Benefit delay', 'Low income', 'Debt crisis',
  'Homeless', 'Refused benefits', 'Domestic abuse',
  'Mental health', 'Redundancy', 'Sickness',
]

export const dietaryOptions = [
  'Halal', 'Kosher', 'Vegetarian', 'Vegan',
  'Gluten free', 'Dairy free', 'Nut allergy', 'No pork',
]

export const repeatReasons = [
  'Ongoing financial hardship',
  'Benefit reassessment in progress',
  'Awaiting housing resolution',
  'Health crisis',
]

export const householdOptions = [
  '1 adult',
  '2 adults',
  '1 adult + 1 child',
  '1 adult + 2 children',
  '2 adults + 1 child',
  '2 adults + 2+ children',
  '3+ adults',
]
