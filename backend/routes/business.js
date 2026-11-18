import express from 'express';
import { 
  getAllBusinesses, 
  getBusinessById, 
  createBusiness, 
  updateBusinessStatus, 
  addReviewToBusiness, 
  addInquiryToBusiness 
} from '../config/store.js';
import auth, { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ============================================================
   1. GET ALL BUSINESSES (WITH DYNAMIC SEARCH, CATEGORY, SORT)
   ============================================================ */
router.get('/all', async (req, res) => {
  try {
    const { 
      search = "", 
      category = "", 
      location = "", 
      minRating = 0, 
      sort = "smart-score",
      status = "approved" 
    } = req.query;

    let businesses = await getAllBusinesses({ status });

    // Filter by search query
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      businesses = businesses.filter(b => 
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.location && b.location.toLowerCase().includes(q)) ||
        (b.city && b.city.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter by category
    if (category && category !== "All" && category.trim() !== "") {
      businesses = businesses.filter(b => 
        b.category && b.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by location / city
    if (location && location !== "All" && location.trim() !== "") {
      const loc = location.trim().toLowerCase();
      businesses = businesses.filter(b => 
        (b.location && b.location.toLowerCase().includes(loc)) ||
        (b.city && b.city.toLowerCase().includes(loc))
      );
    }

    // Filter by minRating
    if (Number(minRating) > 0) {
      businesses = businesses.filter(b => (b.avgRating || 0) >= Number(minRating));
    }

    // Sort
    if (sort === "smart-score") {
      businesses.sort((a, b) => (b.smartScore || 0) - (a.smartScore || 0));
    } else if (sort === "highest-rated") {
      businesses.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (sort === "most-reviewed") {
      businesses.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
    } else if (sort === "views") {
      businesses.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   2. GET FEATURED BUSINESSES
   ============================================================ */
router.get('/featured', async (req, res) => {
  try {
    const businesses = await getAllBusinesses({ status: 'approved' });
    const featured = businesses.filter(b => b.featured || (b.smartScore || 0) >= 9.2).slice(0, 6);
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   3. GET CATEGORIES WITH COUNTS
   ============================================================ */
router.get('/categories', async (req, res) => {
  try {
    const businesses = await getAllBusinesses({ status: 'approved' });
    const categoryMap = {};

    businesses.forEach(b => {
      const cat = b.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name]
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   4. GET PENDING BUSINESSES (FOR ADMIN)
   ============================================================ */
router.get('/pending', async (req, res) => {
  try {
    const businesses = await getAllBusinesses({ status: 'pending' });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   5. GET OWNER'S BUSINESSES
   ============================================================ */
router.get('/owner/my-businesses', optionalAuth, async (req, res) => {
  try {
    const businesses = await getAllBusinesses({});
    if (req.user) {
      const myBusinesses = businesses.filter(b => 
        String(b.ownerId) === String(req.user.id) || 
        (b.email && b.email.toLowerCase() === (req.user.email || '').toLowerCase())
      );
      if (myBusinesses.length > 0) return res.json(myBusinesses);
    }
    // Fallback: return the first business as owner's active listing
    res.json([businesses[0] || {}]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   6. GET SINGLE BUSINESS BY ID
   ============================================================ */
router.get('/:id', async (req, res) => {
  try {
    const business = await getBusinessById(req.params.id);
    if (!business) {
      return res.status(404).json({ msg: "Business not found" });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   7. ADD NEW BUSINESS
   ============================================================ */
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.location) {
      return res.status(400).json({ msg: "Name and Location are required." });
    }

    const payload = {
      ...body,
      ownerId: req.user ? req.user.id : undefined,
      ownerName: body.ownerName || (req.user ? req.user.name : "Business Partner"),
      status: 'pending', // Pending admin approval
      verified: false,
      smartScore: 8.2,
      sentimentScore: 88,
      avgRating: 0,
      ratingCount: 0,
      tags: body.tags || ["Card Payment", "Parking Available", "UPI Accepted"],
      fileUrl: body.fileUrl || body.logo || "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800",
      ratings: [],
      inquiries: []
    };

    const created = await createBusiness(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   8. SUBMIT USER REVIEW FOR A BUSINESS
   ============================================================ */
router.post('/:id/review', optionalAuth, async (req, res) => {
  try {
    const { rating, text, userName } = req.body;
    if (!rating || !text) {
      return res.status(400).json({ msg: "Rating and review text are required." });
    }

    const reviewPayload = {
      rating: Number(rating),
      text,
      userName: userName || (req.user ? req.user.name : "Verified Customer"),
      userId: req.user ? req.user.id : undefined
    };

    const updatedBusiness = await addReviewToBusiness(req.params.id, reviewPayload);
    if (!updatedBusiness) {
      return res.status(404).json({ msg: "Business not found." });
    }

    res.json({
      msg: "Review posted successfully!",
      business: updatedBusiness
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   9. SUBMIT CUSTOMER INQUIRY
   ============================================================ */
router.post('/:id/inquiry', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ msg: "Name, phone, and message are required." });
    }

    const inquiry = await addInquiryToBusiness(req.params.id, { name, phone, email, message });
    res.status(201).json({
      msg: "Inquiry sent successfully to the business owner!",
      inquiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   10. VERIFY / APPROVE / REJECT BUSINESS (ADMIN)
   ============================================================ */
router.put('/verify/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const updated = await updateBusinessStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ msg: "Business not found" });
    }

    res.json({ msg: `Business ${status} successfully!`, business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
