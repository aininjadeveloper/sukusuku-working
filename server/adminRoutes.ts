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

        // 3. Total Credits Used
        const aggregatedCredits = await db
            .select({
                totalUsed: sql<number>`sum(${users.totalCreditsUsed})`,
                avgPenora: sql<number>`avg(${users.penoraCredits})`,
                avgImageGene: sql<number>`avg(${users.imagegeneCredits})`
            })
            .from(users);

        // 4. Recent Registrations (Last 10)
        const recentUsers = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                createdAt: users.createdAt,
                lastLoginAt: users.lastLoginAt,
                totalCreditsUsed: users.totalCreditsUsed
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

        res.json({
            overview: {
                totalUsers,
                newUsers24h,
                activeUsers,
                totalCreditsUsed: Number(aggregatedCredits[0]?.totalUsed || 0),
                avgPenoraCredits: Math.round(Number(aggregatedCredits[0]?.avgPenora || 0)),
                avgImageGeneCredits: Math.round(Number(aggregatedCredits[0]?.avgImageGene || 0)),
            },
            recentUsers,
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
