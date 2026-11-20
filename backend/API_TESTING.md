# Search, Filter, Sort & Pagination API Testing Guide

## Prerequisites

1. MongoDB must be running locally on `mongodb://localhost:27017`
2. Backend server must be running on port 5000
3. Database must be seeded with test data

## Setup Instructions

### 1. Start MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemd
sudo systemctl start mongod

# Manual start
mongod --dbpath /path/to/data
```

### 2. Seed Database
```bash
cd backend
npm run seed
```

Expected output:
```
✅ Successfully seeded 20 phones!

Breakdown:
- Available: 18
- Sold: 1
- Reserved: 1
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

Server should start on `http://localhost:5000`

---

## API Endpoints

### 1. Search Phones
**Endpoint:** `GET /api/phones/search`

**Query Parameters:**
- `q` - Search query (searches title, brand, model)
- `brand` - Filter by brand
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `condition` - Filter by condition (Excellent, Good, Fair, Poor)
- `storage` - Filter by storage (64GB, 128GB, 256GB, 512GB, 1TB)
- `sort` - Sort order (price_asc, price_desc, newest)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 50)

### 2. Get All Phones (with filters)
**Endpoint:** `GET /api/phones`

Same query parameters as search endpoint, but without `q` parameter.

---

## Test Cases

### PHASE 8 - API TESTING

#### 1. Search by Title
```bash
curl "http://localhost:5000/api/phones/search?q=iphone"
```

**Expected:** All phones with "iphone" in title, brand, or model (case-insensitive)

#### 2. Search by Brand
```bash
curl "http://localhost:5000/api/phones/search?q=Samsung"
```

**Expected:** All Samsung phones

#### 3. Search by Model
```bash
curl "http://localhost:5000/api/phones/search?q=Galaxy"
```

**Expected:** All phones with "Galaxy" in model name

#### 4. Case-Insensitive Search
```bash
curl "http://localhost:5000/api/phones/search?q=IPHONE"
curl "http://localhost:5000/api/phones/search?q=apple"
```

**Expected:** Same results regardless of case

#### 5. Filter by Brand
```bash
curl "http://localhost:5000/api/phones?brand=Samsung"
```

**Expected:** Only Samsung phones

#### 6. Filter by Minimum Price
```bash
curl "http://localhost:5000/api/phones?minPrice=50000"
```

**Expected:** Only phones priced ≥ 50000

#### 7. Filter by Maximum Price
```bash
curl "http://localhost:5000/api/phones?maxPrice=40000"
```

**Expected:** Only phones priced ≤ 40000

#### 8. Filter by Condition
```bash
curl "http://localhost:5000/api/phones?condition=Excellent"
```

**Expected:** Only phones in Excellent condition

#### 9. Filter by Storage
```bash
curl "http://localhost:5000/api/phones?storage=256GB"
```

**Expected:** Only phones with 256GB storage

#### 10. Multiple Filters Together
```bash
curl "http://localhost:5000/api/phones?brand=Samsung&minPrice=30000&maxPrice=70000&condition=Good&storage=128GB"
```

**Expected:** Samsung phones, Good condition, 128GB, price between 30000-70000

#### 11. Sort Price Ascending
```bash
curl "http://localhost:5000/api/phones?sort=price_asc"
```

**Expected:** Phones sorted from lowest to highest price

#### 12. Sort Price Descending
```bash
curl "http://localhost:5000/api/phones?sort=price_desc"
```

**Expected:** Phones sorted from highest to lowest price

#### 13. Sort Newest First (Default)
```bash
curl "http://localhost:5000/api/phones?sort=newest"
```

**Expected:** Phones sorted by creation date, newest first

#### 14. Pagination - Page 1
```bash
curl "http://localhost:5000/api/phones?page=1&limit=5"
```

**Expected Response Structure:**
```json
{
  "success": true,
  "totalPhones": 18,
  "currentPage": 1,
  "totalPages": 4,
  "limit": 5,
  "phones": [ /* 5 phones */ ]
}
```

#### 15. Pagination - Page 2
```bash
curl "http://localhost:5000/api/phones?page=2&limit=5"
```

**Expected:** Next 5 phones

#### 16. Invalid Page Number
```bash
curl "http://localhost:5000/api/phones?page=-1"
curl "http://localhost:5000/api/phones?page=abc"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid page number. Must be a positive integer."
}
```

#### 17. Invalid Limit
```bash
curl "http://localhost:5000/api/phones?limit=0"
curl "http://localhost:5000/api/phones?limit=-5"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid limit. Must be a positive integer."
}
```

#### 18. Invalid Price Values
```bash
curl "http://localhost:5000/api/phones?minPrice=-100"
curl "http://localhost:5000/api/phones?minPrice=abc"
curl "http://localhost:5000/api/phones?maxPrice=xyz"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid minPrice value. Must be a non-negative number."
}
```

#### 19. Minimum Price Greater Than Maximum Price
```bash
curl "http://localhost:5000/api/phones?minPrice=50000&maxPrice=30000"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "minPrice cannot be greater than maxPrice."
}
```

#### 20. No Matching Results
```bash
curl "http://localhost:5000/api/phones/search?q=NonExistentPhone123"
```

**Expected Response:**
```json
{
  "success": true,
  "totalPhones": 0,
  "currentPage": 1,
  "totalPages": 0,
  "limit": 10,
  "phones": []
}
```

#### 21. Confirm Only Available Listings Shown
```bash
curl "http://localhost:5000/api/phones"
```

**Expected:** Only phones with `status: "available"` (should be 18 phones)
- Should NOT include sold or reserved phones by default

---

## Advanced Test Cases

### Complex Query Example
```bash
curl "http://localhost:5000/api/phones/search?q=iphone&minPrice=40000&maxPrice=80000&condition=Excellent&sort=price_asc&page=1&limit=5"
```

**Expected:** iPhone models, Excellent condition, price 40000-80000, sorted by price ascending, first 5 results

### Edge Cases

#### Empty Search Query
```bash
curl "http://localhost:5000/api/phones/search?q="
```

**Expected:** Returns all available phones (no search filter applied)

#### Limit Exceeding Maximum
```bash
curl "http://localhost:5000/api/phones?limit=100"
```

**Expected:** Returns maximum 50 phones (capped at 50)

#### Invalid Sort Value
```bash
curl "http://localhost:5000/api/phones?sort=invalid_sort"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid sort value. Must be one of: price_asc, price_desc, newest"
}
```

#### Invalid Condition
```bash
curl "http://localhost:5000/api/phones?condition=Brand New"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid condition. Must be one of: Excellent, Good, Fair, Poor"
}
```

#### Invalid Storage
```bash
curl "http://localhost:5000/api/phones?storage=2TB"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid storage. Must be one of: 64GB, 128GB, 256GB, 512GB, 1TB"
}
```

---

## Testing with JavaScript/Frontend

### Example Fetch Request
```javascript
// Search for iPhones
fetch('http://localhost:5000/api/phones/search?q=iphone')
  .then(res => res.json())
  .then(data => console.log(data));

// Filter with multiple parameters
const params = new URLSearchParams({
  brand: 'Samsung',
  minPrice: 30000,
  maxPrice: 70000,
  condition: 'Good',
  sort: 'price_asc',
  page: 1,
  limit: 10
});

fetch(`http://localhost:5000/api/phones?${params}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### Example React Hook
```javascript
import { useState, useEffect } from 'react';

function usePhoneSearch(filters) {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(filters);
    
    fetch(`http://localhost:5000/api/phones?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPhones(data.phones);
          setPagination({
            totalPhones: data.totalPhones,
            currentPage: data.currentPage,
            totalPages: data.totalPages
          });
        } else {
          setError(data.message);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return { phones, loading, error, pagination };
}
```

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
      "description": "Barely used iPhone 15 Pro Max...",
      "images": [],
      "seller": {
        "_id": "65a1b2c3d4e5f6789012345",
        "name": "Test Seller",
        "email": "seller@test.com"
      },
      "createdAt": "2024-01-13T10:30:00.000Z",
      "updatedAt": "2024-01-13T10:30:00.000Z"
    }
    // ... more phones
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## Notes

1. **Only Available Listings:** By default, all endpoints return only phones with `status: "available"`. Sold and reserved phones are excluded.

2. **Case-Insensitive Searches:** All text searches (title, brand, model) are case-insensitive.

3. **Regex Safety:** User input is escaped to prevent regex injection attacks.

4. **Pagination Limits:** Maximum limit per page is 50 to prevent excessive data retrieval.

5. **Validation:** All query parameters are validated before processing.

6. **Secondary Sorting:** Price sorts include secondary sort by createdAt. Newest sort includes secondary sort by _id for consistency.

7. **Seller Information:** Phone listings include populated seller name and email (password excluded).
