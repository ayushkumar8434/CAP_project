# Member 2 - Search, Filter, Sorting & Pagination Implementation

## Overview

This document describes the implementation of search, filter, sorting, and pagination functionality for the PocketPhone marketplace backend.

## Implementation Summary

### Files Created

1. **Models**
   - `backend/src/models/Phone.js` - Phone model with Mongoose schema

2. **Controllers**
   - `backend/src/controllers/searchController.js` - Search and filter logic

3. **Routes**
   - `backend/src/routes/searchRoutes.js` - API route definitions

4. **Utilities**
   - `backend/src/seedPhones.js` - Database seeding script

5. **Documentation**
   - `backend/API_TESTING.md` - Comprehensive API testing guide
   - `backend/PocketPhone_Search_API.postman_collection.json` - Postman collection
   - `backend/MEMBER_2_IMPLEMENTATION.md` - This file

### Files Modified

1. **backend/src/server.js**
   - Added import for searchRoutes
   - Mounted `/api/phones` route

2. **backend/package.json**
   - Added `seed` script for database seeding

---

## Phone Model

### Schema

```javascript
{
  title: String (required),
  brand: String (required),
  model: String (required),
  price: Number (required, min: 0),
  condition: String (enum: ["Excellent", "Good", "Fair", "Poor"]),
  storage: String (enum: ["64GB", "128GB", "256GB", "512GB", "1TB"]),
  status: String (enum: ["available", "sold", "reserved"], default: "available"),
  description: String,
  images: [String],
  seller: ObjectId (ref: "User", required),
  timestamps: true (createdAt, updatedAt)
}
```

### Indexes

- Text index on `title`, `brand`, `model` for search performance
- Compound index on `brand`, `price`, `status` for filter performance

---

## API Endpoints

### 1. GET /api/phones/search

Search phones by keyword across title, brand, and model fields.

**Query Parameters:**
- `q` (string) - Search query
- `brand` (string) - Filter by brand
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `condition` (string) - Filter by condition
- `storage` (string) - Filter by storage
- `sort` (string) - Sort order (price_asc, price_desc, newest)
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 10, max: 50)

**Example:**
```
GET /api/phones/search?q=iphone&minPrice=40000&condition=Excellent&sort=price_asc&page=1&limit=10
```

### 2. GET /api/phones

Get all phones with filtering, sorting, and pagination (no text search).

**Query Parameters:**
Same as `/search` endpoint, except no `q` parameter.

**Example:**
```
GET /api/phones?brand=Samsung&maxPrice=50000&sort=newest&page=1&limit=10
```

---

## Features Implemented

### ✅ Search Functionality

- **Case-insensitive search** on title, brand, and model
- **Regex injection protection** - special characters are escaped
- **Partial matching** - "iphone" matches "iPhone 15 Pro Max"
- **Empty query handling** - returns all available phones if no query provided

### ✅ Filter Functionality

1. **Brand Filter**
   - Case-insensitive exact match
   - Example: `?brand=Samsung`

2. **Price Range Filter**
   - Minimum price: `?minPrice=10000`
   - Maximum price: `?maxPrice=50000`
   - Both: `?minPrice=10000&maxPrice=50000`
   - Validation: non-negative, finite numbers
   - Validation: minPrice ≤ maxPrice

3. **Condition Filter**
   - Values: Excellent, Good, Fair, Poor
   - Case-insensitive validation
   - Example: `?condition=Excellent`

4. **Storage Filter**
   - Values: 64GB, 128GB, 256GB, 512GB, 1TB
   - Exact match required
   - Example: `?storage=256GB`

5. **Combined Filters**
   - All filters can be used together
   - MongoDB query builder combines them with AND logic

### ✅ Sorting Functionality

1. **price_asc** - Price low to high
   - Secondary sort: newest first (createdAt desc)

2. **price_desc** - Price high to low
   - Secondary sort: newest first (createdAt desc)

3. **newest** (default) - Newest listings first
   - Primary sort: createdAt desc
   - Secondary sort: _id desc (for consistency)

### ✅ Pagination Functionality

- **Default values:** page=1, limit=10
- **Limit cap:** Maximum 50 results per page
- **Skip calculation:** `(page - 1) * limit`
- **Total count:** Uses `countDocuments()` to get total matching records
- **Metadata returned:**
  - `totalPhones` - Total matching records
  - `currentPage` - Current page number
  - `totalPages` - Total pages available
  - `limit` - Results per page
  - `phones` - Array of phone objects

### ✅ Default Behavior

- **Only available listings** - Automatically filters `status: "available"`
- **Sold and reserved phones are excluded** from all results by default

### ✅ Validation

1. **Query Parameters:**
   - Page number must be positive integer
   - Limit must be positive integer
   - Sort value must be valid (price_asc, price_desc, newest)

2. **Price Validation:**
   - Must be finite non-negative numbers
   - minPrice cannot exceed maxPrice

3. **Enum Validation:**
   - Condition must match schema enum
   - Storage must match schema enum

4. **Error Responses:**
   - Clear error messages
   - HTTP 400 for validation errors
   - HTTP 500 for server errors

---

## Database Seeding

### Usage

```bash
cd backend
npm run seed
```

### What It Does

- Creates a test user if none exists
- Clears existing phone listings
- Inserts 20 sample phones
  - 18 available
  - 1 sold
  - 1 reserved
- Mix of brands: Apple, Samsung, OnePlus, Google, Xiaomi
- Price range: ₹28,000 - ₹95,000
- Various conditions and storage options

---

## Response Structure

### Success Response

```json
{
  "success": true,
  "totalPhones": 18,
  "currentPage": 1,
  "totalPages": 2,
  "limit": 10,
  "phones": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "title": "iPhone 15 Pro Max - Excellent Condition",
      "brand": "Apple",
      "model": "iPhone 15 Pro Max",
      "price": 85000,
      "condition": "Excellent",
      "storage": "256GB",
      "status": "available",
      "description": "Barely used...",
      "images": [],
      "seller": {
        "_id": "...",
        "name": "Test Seller",
        "email": "seller@test.com"
      },
      "createdAt": "2024-01-13T10:30:00.000Z",
      "updatedAt": "2024-01-13T10:30:00.000Z"
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid page number. Must be a positive integer."
}
```

---

## Frontend Integration Guide

### Basic Fetch Example

```javascript
const searchPhones = async (query) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/phones/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (data.success) {
      return data.phones;
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### React Component Example

```javascript
import { useState, useEffect } from 'react';

function PhoneSearch() {
  const [phones, setPhones] = useState([]);
  const [filters, setFilters] = useState({
    q: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    sort: 'newest',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhones = async () => {
      setLoading(true);
      
      // Build query string
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      try {
        const endpoint = filters.q 
          ? '/api/phones/search' 
          : '/api/phones';
        
        const response = await fetch(
          `http://localhost:5000${endpoint}?${params}`
        );
        const data = await response.json();
        
        if (data.success) {
          setPhones(data.phones);
          setPagination({
            totalPhones: data.totalPhones,
            currentPage: data.currentPage,
            totalPages: data.totalPages
          });
        }
      } catch (error) {
        console.error('Failed to fetch phones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhones();
  }, [filters]);

  return (
    <div>
      {/* Search and filter UI */}
      <input 
        value={filters.q}
        onChange={(e) => setFilters({...filters, q: e.target.value})}
        placeholder="Search phones..."
      />
      
      {/* Display results */}
      {loading ? <p>Loading...</p> : (
        <>
          {phones.map(phone => (
            <div key={phone._id}>
              <h3>{phone.title}</h3>
              <p>₹{phone.price}</p>
            </div>
          ))}
          
          <p>
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        </>
      )}
    </div>
  );
}
```

### Advanced Filter Component

```javascript
function PhoneFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    storage: '',
    sort: 'newest'
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters">
      <select 
        value={filters.brand}
        onChange={(e) => handleChange('brand', e.target.value)}
      >
        <option value="">All Brands</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="OnePlus">OnePlus</option>
        <option value="Google">Google</option>
        <option value="Xiaomi">Xiaomi</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(e) => handleChange('minPrice', e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) => handleChange('maxPrice', e.target.value)}
      />

      <select
        value={filters.condition}
        onChange={(e) => handleChange('condition', e.target.value)}
      >
        <option value="">All Conditions</option>
        <option value="Excellent">Excellent</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Poor">Poor</option>
      </select>

      <select
        value={filters.storage}
        onChange={(e) => handleChange('storage', e.target.value)}
      >
        <option value="">All Storage</option>
        <option value="64GB">64GB</option>
        <option value="128GB">128GB</option>
        <option value="256GB">256GB</option>
        <option value="512GB">512GB</option>
        <option value="1TB">1TB</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) => handleChange('sort', e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
```

---

## Integration with Member 1

### Coordination Points

1. **Phone Model**
   - The Phone model created here should be reviewed by Member 1
   - If Member 1 already has a Phone model, this one should be merged with theirs
   - Ensure no duplicate models exist

2. **Route Registration**
   - **CRITICAL:** `/api/phones/search` must be registered BEFORE `/api/phones/:id`
   - Otherwise "search" will be treated as a phone ID
   - Current server.js mounts searchRoutes correctly

3. **Schema Fields**
   - Confirm with Member 1 that schema fields match their requirements
   - Current schema includes all fields mentioned in requirements
   - Additional fields can be added if needed

4. **Seller Reference**
   - Phone model references User model via `seller` field
   - Ensures each phone is associated with the user who listed it

---

## Integration with Member 3

### No Conflicts

- Member 3's authentication and user functionality is untouched
- Search routes are independent of auth routes
- No modifications to existing User model
- No changes to auth middleware

---

## Testing

### Prerequisites

1. MongoDB running locally
2. Backend server running (`npm run dev`)
3. Database seeded with test data (`npm run seed`)

### Testing Methods

1. **Browser**
   ```
   http://localhost:5000/api/phones?brand=Apple
   ```

2. **curl**
   ```bash
   curl "http://localhost:5000/api/phones/search?q=iphone"
   ```

3. **Postman**
   - Import `PocketPhone_Search_API.postman_collection.json`
   - Run tests from collection

4. **Frontend**
   - Use fetch/axios from React components
   - See Frontend Integration Guide above

### Test Coverage

See `API_TESTING.md` for complete test cases covering:
- ✅ Search functionality (4 tests)
- ✅ Filter functionality (7 tests)
- ✅ Sorting functionality (3 tests)
- ✅ Pagination functionality (3 tests)
- ✅ Validation (7 tests)
- ✅ Edge cases (multiple tests)

---

## Known Limitations

1. **Text Search Performance**
   - Text indexes are created for better search performance
   - For very large datasets, consider implementing Elasticsearch

2. **Image URLs**
   - Phone model includes `images` array
   - Currently stores URLs as strings
   - Image upload functionality would be implemented by another member

3. **Seller Authentication**
   - Search endpoints do not require authentication
   - This is intentional - browsing should be public
   - Listing creation/editing would require auth (Member 1)

4. **Status Management**
   - Only "available" phones are shown by default
   - Endpoint to update phone status would be in Member 1's scope

---

## Performance Considerations

1. **Database Indexes**
   - Text index on searchable fields
   - Compound index on commonly filtered fields
   - Improves query performance significantly

2. **Pagination**
   - Prevents loading entire dataset
   - Max limit of 50 prevents excessive data transfer

3. **Selective Field Population**
   - Only includes necessary seller fields (name, email)
   - Excludes password and unnecessary data

4. **Query Optimization**
   - Filters applied at database level
   - Sorting done by MongoDB, not in application
   - Uses skip/limit for efficient pagination

---

## Security Features

1. **Regex Injection Protection**
   - User input is escaped before regex creation
   - Prevents malicious regex patterns

2. **Input Validation**
   - All query parameters validated before use
   - Type checking for numbers
   - Enum validation for restricted fields

3. **Seller Data Protection**
   - Password excluded from populated seller data
   - Only necessary fields returned

4. **Error Handling**
   - Try-catch blocks for all database operations
   - Graceful error responses
   - Error details logged server-side only

---

## Future Enhancements

1. **Full-Text Search**
   - Implement Elasticsearch for advanced search
   - Support for search suggestions/autocomplete

2. **Faceted Search**
   - Show available filter options with counts
   - "Apple (15)", "Samsung (8)", etc.

3. **Search Analytics**
   - Track popular search terms
   - Suggest trending phones

4. **Advanced Filters**
   - RAM, camera specs, battery capacity
   - Color, warranty status, accessories included

5. **Saved Searches**
   - Allow users to save search criteria
   - Email alerts for new matching listings

---

## Contact & Support

For questions about this implementation:

1. Check `API_TESTING.md` for usage examples
2. Review this document for integration details
3. Test with Postman collection
4. Coordinate with Member 1 for Phone model integration

---

## Summary

✅ **Complete implementation** of search, filter, sorting, and pagination  
✅ **20+ test cases** documented and ready  
✅ **Frontend integration guide** with React examples  
✅ **Database seeding** for immediate testing  
✅ **Security and validation** built-in  
✅ **Performance optimized** with indexes  
✅ **No conflicts** with existing backend features  
✅ **Ready for integration** with Member 1's Phone management  

The search functionality is production-ready and follows best practices for MongoDB queries, input validation, and API design.
