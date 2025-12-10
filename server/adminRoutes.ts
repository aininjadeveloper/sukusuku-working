import { Router } from "express";
import { storage } from "./storage";
import { users } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";

export const adminRouter = Router();

// Middleware to check admin session
const isAdmin = (req: any, res: any, next: any) => {
    if ((req.session as any).isAdmin) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized: Admin access required" });
};

// Admin Login Route
adminRouter.post("/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return res.status(500).json({ message: "Admin password not configured on server" });
    }

    // Debugging: Log interactions (safe)
    console.log(`Admin login attempt. Input length: ${password?.length}, Expected length: ${adminPassword?.length}`);

    if (password === adminPassword) {
        (req.session as any).isAdmin = true;
        return res.json({ message: "Admin login successful" });
    }

    // Robust check: trim whitespace
    if (password?.trim() === adminPassword?.trim()) {
        (req.session as any).isAdmin = true;
        console.log("Admin login successful after trimming whitespace");
        return res.json({ message: "Admin login successful" });
    }

    res.status(401).json({ message: "Invalid password" });
});

// Admin Stats Route
adminRouter.get("/stats", isAdmin, async (req, res) => {
    try {
        // 1. Total Users
        const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
        const totalUsers = Number(totalUsersResult[0]?.count || 0);

        // 2. New Users in last 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newUsersResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(sql`${users.createdAt} > ${oneDayAgo}`);
        const newUsers24h = Number(newUsersResult[0]?.count || 0);

        // Active Users (Last 10 mins)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const activeUsersResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(sql`${users.lastLoginAt} > ${tenMinutesAgo}`);
        const activeUsers = Number(activeUsersResult[0]?.count || 0);

        // 3. Total Credits Used and breakdown
        const aggregatedCredits = await db
            .select({
                totalUsed: sql<number>`sum(${users.totalCreditsUsed})`,
                avgPenora: sql<number>`avg(${users.penoraCredits})`,
                avgImageGene: sql<number>`avg(${users.imagegeneCredits})`,
                totalPenoraRemaining: sql<number>`sum(${users.penoraCredits})`,
                totalImageGeneRemaining: sql<number>`sum(${users.imagegeneCredits})`
            })
            .from(users);

        // 4. Recent Registrations (Last 10) with credit details
        const recentUsers = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt,
                totalCreditsUsed: users.totalCreditsUsed,
                penoraCredits: users.penoraCredits,
                imagegeneCredits: users.imagegeneCredits
            })
            .from(users)
            .orderBy(desc(users.createdAt))
            .limit(10);

        // 5. Daily Registrations (Last 7 days) for chart
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailyRegistrations = await db.execute(sql`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at > ${sevenDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

        // 6. Users with highest credit usage
        const topCreditsUsers = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                totalCreditsUsed: users.totalCreditsUsed,
                penoraCredits: users.penoraCredits,
                imagegeneCredits: users.imagegeneCredits,
                lastLoginAt: users.lastLoginAt
            })
            .from(users)
            .orderBy(desc(users.totalCreditsUsed))
            .limit(5);

        res.json({
            overview: {
                totalUsers,
                newUsers24h,
                activeUsers,
                totalCreditsUsed: Number(aggregatedCredits[0]?.totalUsed || 0),
                avgPenoraCredits: Math.round(Number(aggregatedCredits[0]?.avgPenora || 0)),
                avgImageGeneCredits: Math.round(Number(aggregatedCredits[0]?.avgImageGene || 0)),
                totalPenoraRemaining: Number(aggregatedCredits[0]?.totalPenoraRemaining || 0),
                totalImageGeneRemaining: Number(aggregatedCredits[0]?.totalImageGeneRemaining || 0)
            },
            recentUsers,
            topCreditsUsers,
            dailyRegistrations: dailyRegistrations.rows
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

// One-time fix: Update all users' Penora Credits to 50
adminRouter.post("/fix-credits", isAdmin, async (req, res) => {
    try {
        console.log("Starting credit fix migration...");
        const result = await db.update(users)
            .set({ penoraCredits: 50 })
            .returning();

        console.log(`Updated ${result.length} users to 50 Penora Credits.`);
        res.json({ message: `Successfully updated ${result.length} users.`, count: result.length });
    } catch (error) {
        console.error("Credit fix error:", error);
        res.status(500).json({ message: "Failed to fix credits" });
    }
});

// Admin Logout
adminRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

// Update user credits manually
adminRouter.post("/user/:userId/credits", isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { penoraCredits, imagegeneCredits } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }

        const updateData: any = { updatedAt: new Date() };
        if (penoraCredits !== undefined) updateData.penoraCredits = penoraCredits;
        if (imagegeneCredits !== undefined) updateData.imagegeneCredits = imagegeneCredits;

        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Admin updated credits for user ${userId}: Penora=${updateData.penoraCredits}, ImageGene=${updateData.imagegeneCredits}`);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user credits:", error);
        res.status(500).json({ message: "Failed to update user credits" });
    }
});

// Get detailed user info
adminRouter.get("/user/:userId", isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

// Search and filter users
adminRouter.get("/users/search", isAdmin, async (req, res) => {
    try {
        const { email, firstName, minCreditsUsed, maxCreditsUsed, limit } = req.query;

        let query = db.select().from(users);
        
        if (email) {
            query = query.where(sql`${users.email} ILIKE ${`%${email}%`}`);
        }
        
        if (firstName) {
            query = query.where(sql`${users.firstName} ILIKE ${`%${firstName}%`}`);
        }

        const results = await query.limit(parseInt(limit as string) || 50);
        
        // Filter by credits used if provided
        let filtered = results;
        if (minCreditsUsed !== undefined || maxCreditsUsed !== undefined) {
            filtered = results.filter(user => {
                const used = user.totalCreditsUsed || 0;
                if (minCreditsUsed !== undefined && used < parseInt(minCreditsUsed as string)) return false;
                if (maxCreditsUsed !== undefined && used > parseInt(maxCreditsUsed as string)) return false;
                return true;
            });
        }

        res.json(filtered);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Failed to search users" });
    }
});
