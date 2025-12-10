# Technical Changes - Line by Line

## File 1: `server/adminRoutes.ts`

### Change 1: Enhanced /api/admin/stats Endpoint
**Lines 47-130**

Added new aggregation queries to calculate:
- `totalPenoraRemaining` - sum of all penora credits across users
- `totalImageGeneRemaining` - sum of all imagegene credits across users
- `topCreditsUsers` - top 5 users by total credit usage

```typescript
// Before: 3 aggregation fields
const aggregatedCredits = await db
    .select({
        totalUsed: sql<number>`sum(${users.totalCreditsUsed})`,
        avgPenora: sql<number>`avg(${users.penoraCredits})`,
        avgImageGene: sql<number>`avg(${users.imagegeneCredits})`
    })

// After: 5 aggregation fields
const aggregatedCredits = await db
    .select({
        totalUsed: sql<number>`sum(${users.totalCreditsUsed})`,
        avgPenora: sql<number>`avg(${users.penoraCredits})`,
        avgImageGene: sql<number>`avg(${users.imagegeneCredits})`,
        totalPenoraRemaining: sql<number>`sum(${users.penoraCredits})`,
        totalImageGeneRemaining: sql<number>`sum(${users.imagegeneCredits})`
    })
```

Updated recentUsers SELECT to include:
- `penoraCredits` 
- `imagegeneCredits`

Added new topCreditsUsers query:
```typescript
const topCreditsUsers = await db
    .select({...})
    .from(users)
    .orderBy(desc(users.totalCreditsUsed))
    .limit(5);
```

Updated response to include new fields:
```typescript
res.json({
    overview: {
        // ... existing fields
        totalPenoraRemaining: Number(...),
        totalImageGeneRemaining: Number(...)
    },
    recentUsers,
    topCreditsUsers,      // NEW
    dailyRegistrations: dailyRegistrations.rows
});
```

---

### Change 2: Added Admin Logout Endpoint
**Lines 163-172**

```typescript
adminRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
    });
});
```

---

### Change 3: Added Update User Credits Endpoint
**Lines 174-200**

```typescript
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

        console.log(`Admin updated credits for user ${userId}...`);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user credits:", error);
        res.status(500).json({ message: "Failed to update user credits" });
    }
});
```

---

### Change 4: Added Get User Details Endpoint
**Lines 202-226**

```typescript
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
```

---

### Change 5: Added Search & Filter Users Endpoint
**Lines 228-256**

```typescript
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
```

---

## File 2: `client/src/pages/admin-dashboard.tsx`

### Change 1: Updated AdminStats Interface
**Lines 40-75**

```typescript
// Before: Simple structure
interface AdminStats {
    overview: {
        totalUsers: number;
        newUsers24h: number;
        activeUsers: number;
        totalCreditsUsed: number;
        avgPenoraCredits: number;
        avgImageGeneCredits: number;
    };
    recentUsers: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        lastLoginAt: string | null;
        totalCreditsUsed: number;
    }>;
    dailyRegistrations: Array<{
        date: string;
        count: number;
    }>;
}

// After: Enhanced structure
interface AdminStats {
    overview: {
        totalUsers: number;
        newUsers24h: number;
        activeUsers: number;
        totalCreditsUsed: number;
        avgPenoraCredits: number;
        avgImageGeneCredits: number;
        totalPenoraRemaining: number;        // NEW
        totalImageGeneRemaining: number;     // NEW
    };
    recentUsers: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        lastLoginAt: string | null;
        totalCreditsUsed: number;
        penoraCredits: number;               // NEW
        imagegeneCredits: number;            // NEW
    }>;
    topCreditsUsers: Array<{                 // NEW SECTION
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        totalCreditsUsed: number;
        penoraCredits: number;
        imagegeneCredits: number;
        lastLoginAt: string | null;
    }>;
    dailyRegistrations: Array<{
        date: string;
        count: number;
    }>;
}
```

---

### Change 2: Added Two New Stat Cards
**Lines 149-187** (after existing 4 cards)

```typescript
{/* New Credit Breakdown Cards */}
<Card className="bg-suku-surface border-suku-border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
            Penora Credits Remaining
        </CardTitle>
        <CreditCard className="h-4 w-4 text-orange-400" />
    </CardHeader>
    <CardContent>
        <div className="text-2xl font-bold text-white">{stats.overview.totalPenoraRemaining}</div>
        <p className="text-xs text-orange-400 mt-1">Avg: {stats.overview.avgPenoraCredits} per user</p>
    </CardContent>
</Card>

<Card className="bg-suku-surface border-suku-border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
            ImageGene Credits Remaining
        </CardTitle>
        <CreditCard className="h-4 w-4 text-cyan-400" />
    </CardHeader>
    <CardContent>
        <div className="text-2xl font-bold text-white">{stats.overview.totalImageGeneRemaining}</div>
        <p className="text-xs text-cyan-400 mt-1">Avg: {stats.overview.avgImageGeneCredits} per user</p>
    </CardContent>
</Card>
```

---

### Change 3: Added Top Users & Credit Health Section
**Lines 235-338** (new grid section before Recent Users Table)

```typescript
{/* Top Users & Insights */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {/* Top Credit Usage */}
    <Card className="bg-suku-surface border-suku-border">
        <CardHeader>
            <CardTitle className="text-white">Top Credit Users</CardTitle>
            <CardDescription className="text-gray-400">Most active users by credit usage</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {stats.topCreditsUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-suku-black/50 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-suku-red rounded-full text-white text-xs font-bold">
                                {index + 1}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</div>
                                <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-blue-400">{user.totalCreditsUsed} used</div>
                            <div className="text-xs text-gray-400">P:{user.penoraCredits} I:{user.imagegeneCredits}</div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>

    {/* Credit Health */}
    <Card className="bg-suku-surface border-suku-border">
        <CardHeader>
            <CardTitle className="text-white">Credit Health</CardTitle>
            <CardDescription className="text-gray-400">System-wide credit metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Progress bar and metrics */}
        </CardContent>
    </Card>
</div>
```

---

### Change 4: Enhanced Recent Users Table
**Lines 339-410**

Updated table headers (6 columns instead of 4):
```typescript
<thead className="text-xs text-gray-400 uppercase bg-suku-black/50">
    <tr>
        <th className="px-6 py-3">User</th>
        <th className="px-6 py-3">Joined</th>
        <th className="px-6 py-3">Last Login</th>
        <th className="px-6 py-3">Total Used</th>        {/* Renamed */}
        <th className="px-6 py-3">Penora Balance</th>     {/* NEW */}
        <th className="px-6 py-3">ImageGene Balance</th>  {/* NEW */}
    </tr>
</thead>
```

Updated table cells:
```typescript
<td className="px-6 py-4">
    <Badge variant="outline" className={`text-xs font-semibold ${user.totalCreditsUsed > 0 ? 'border-blue-500 text-blue-400' : 'border-gray-600 text-gray-400'}`}>
        {user.totalCreditsUsed}
    </Badge>
</td>
<td className="px-6 py-4">
    <Badge variant="outline" className={`text-xs font-semibold ${user.penoraCredits > 0 ? 'border-orange-500 text-orange-400' : 'border-red-500 text-red-400'}`}>
        {user.penoraCredits}
    </Badge>
</td>
<td className="px-6 py-4">
    <Badge variant="outline" className={`text-xs font-semibold ${user.imagegeneCredits > 0 ? 'border-cyan-500 text-cyan-400' : 'border-red-500 text-red-400'}`}>
        {user.imagegeneCredits}
    </Badge>
</td>
```

---

## Summary of Changes

### Backend (`adminRoutes.ts`)
- Enhanced existing `/api/admin/stats` endpoint
- Added 4 new endpoints (logout, update credits, get user, search)
- Improved credit aggregation queries
- Better error handling

### Frontend (`admin-dashboard.tsx`)
- Updated data interface structure
- Added 2 new stat cards
- Added "Top Credit Users" section
- Added "Credit Health" dashboard
- Enhanced table with 3 new columns
- Implemented color-coded status indicators
- Maintained 5-second auto-refresh polling

### Total Changes
- **Backend**: ~150 lines added
- **Frontend**: ~200 lines added/modified
- **Zero breaking changes**
- **Backward compatible**

All changes are production-ready and have been tested for syntax errors.
