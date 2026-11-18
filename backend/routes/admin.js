import express from 'express';
import { 
  getAllBusinesses, 
  updateBusinessStatus, 
  getBusinessById 
} from '../config/store.js';

const router = express.Router();

// Fallback dummy users list for Admin panel
let adminUsersList = [
  { id: "U-881", name: "Ishan Rajput", email: "ishan@test.com", phone: "+91 9876500001", role: "Customer", status: "Active", joined: "15 Mar 2026" },
  { id: "U-882", name: "Sneha Kapoor", email: "sneha.k@test.com", phone: "+91 9876500002", role: "Customer", status: "Active", joined: "22 Mar 2026" },
  { id: "U-883", name: "Amitabh Raj", email: "amit.r@test.com", phone: "+91 9876500003", role: "Customer", status: "Banned", joined: "01 Apr 2026" },
  { id: "U-884", name: "Vikram Singh", email: "vikram@test.com", phone: "+91 9876500004", role: "Partner", status: "Active", joined: "05 Apr 2026" },
  { id: "U-885", name: "Pooja Desai", email: "pooja.d@test.com", phone: "+91 9876500005", role: "Customer", status: "Active", joined: "09 Apr 2026" },
  { id: "U-886", name: "Aarav Sharma", email: "aarav@test.com", phone: "+91 9876500006", role: "Customer", status: "Active", joined: "14 Apr 2026" }
];

/* 1. GET PENDING BUSINESSES */
router.get('/pending-businesses', async (req, res) => {
  try {
    const all = await getAllBusinesses({});
    const pending = all.filter(b => b.status === 'pending');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 2. APPROVE BUSINESS */
router.put('/business/:id/approve', async (req, res) => {
  try {
    const updated = await updateBusinessStatus(req.params.id, 'approved');
    if (!updated) return res.status(404).json({ message: "Business not found" });
    res.json({ message: "Business Approved Successfully", business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 3. REJECT BUSINESS */
router.put('/business/:id/reject', async (req, res) => {
  try {
    const updated = await updateBusinessStatus(req.params.id, 'rejected');
    if (!updated) return res.status(404).json({ message: "Business not found" });
    res.json({ message: "Business Rejected", business: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 4. OVERALL STATS */
router.get('/stats', async (req, res) => {
  try {
    const all = await getAllBusinesses({});
    const approvedCount = all.filter(b => b.status === 'approved').length;
    const pendingCount = all.filter(b => b.status === 'pending').length;
    const totalReviews = all.reduce((acc, b) => acc + (b.ratingCount || 0), 0);
    const totalInquiries = all.reduce((acc, b) => acc + ((b.inquiries && b.inquiries.length) || 0), 0);

    res.json({
      totalBusinesses: all.length,
      approvedBusinesses: approvedCount,
      pendingApprovals: pendingCount,
      totalUsers: adminUsersList.length,
      totalReviews,
      totalInquiries,
      estimatedRevenue: "₹84,250"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 5. GET USERS LIST */
router.get('/users', (req, res) => {
  res.json(adminUsersList);
});

/* 6. TOGGLE USER BAN STATUS */
router.put('/users/:id/toggle-ban', (req, res) => {
  const user = adminUsersList.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = user.status === 'Active' ? 'Banned' : 'Active';
  res.json({ message: `User status changed to ${user.status}`, user });
});

export default router;
