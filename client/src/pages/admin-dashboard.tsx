import { useQuery } from "@tanstack/react-query";
import {
    Users,
    UserPlus,
    CreditCard,
    Activity,
    LogOut,
    Search
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { useState } from "react";

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

export default function AdminDashboard() {
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: stats, isLoading, error } = useQuery<AdminStats>({
        queryKey: ["/api/admin/stats"],
        retry: false,
    });

    const handleLogout = async () => {
        try {
            await apiRequest("POST", "/api/admin/logout");
            navigate("/admin/login");
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-suku-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-suku-red"></div>
            </div>
        );
    }

    if (error || !stats) {
        // Redirect to login if unauthorized or error
        // Use a small timeout to avoid render cycle issues if needed, or just return null and effect
        // But since we are in render, we can't navigate. Better to use an effect or just show error.
        // For simplicity, we'll show a button to go back to login.
        return (
            <div className="min-h-screen bg-suku-black flex flex-col items-center justify-center text-white">
                <p className="mb-4">Access Denied or Failed to Load</p>
                <Button onClick={() => navigate("/admin/login")}>Go to Admin Login</Button>
            </div>
        );
    }

    // Filter users based on search
    const filteredUsers = stats.recentUsers.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName + " " + user.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pieData = [
        { name: 'Penora', value: stats.overview.avgPenoraCredits },
        { name: 'ImageGene', value: stats.overview.avgImageGeneCredits },
    ];
    const RED_COLORS = ['#F40009', '#aa0006'];

    return (
        <div className="min-h-screen bg-suku-black text-white p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-suku-border">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="text-suku-red" />
                        Mission Control
                    </h1>
                    <p className="text-gray-400 mt-1">SukuSuku.ai Platform Overview</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-suku-border text-gray-300 hover:bg-suku-red hover:text-white"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-suku-surface border-suku-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-suku-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.overview.totalUsers}</div>
                        <p className="text-xs text-gray-400 mt-1">Lifetime registrations</p>
                    </CardContent>
                </Card>

                <Card className="bg-suku-surface border-suku-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            New Users (24h)
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-2xl font-bold text-white">+{stats.overview.newUsers24h}</div>
                                <p className="text-xs text-green-500 mt-1">Growth rate</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-white mb-1">{stats.overview.activeUsers}</div>
                                <p className="text-xs text-suku-red">Active now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-suku-surface border-suku-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Credits Used
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.overview.totalCreditsUsed}</div>
                        <p className="text-xs text-gray-400 mt-1">Across all apps</p>
                    </CardContent>
                </Card>

                <Card className="bg-suku-surface border-suku-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Avg. Balance
                        </CardTitle>
                        <Activity className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {Math.round((stats.overview.avgPenoraCredits + stats.overview.avgImageGeneCredits) / 2)}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Avg credits per user</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Growth Chart */}
                <Card className="bg-suku-surface border-suku-border col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white">Registration Trend</CardTitle>
                        <CardDescription className="text-gray-400">Last 7 days of user growth</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.dailyRegistrations}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666' }} />
                                <YAxis stroke="#666" tick={{ fill: '#666' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#F40009"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Credit Distribution */}
                <Card className="bg-suku-surface border-suku-border col-span-1">
                    <CardHeader>
                        <CardTitle className="text-white">Credit Distribution</CardTitle>
                        <CardDescription className="text-gray-400">Average balance per app</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pieData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    cursor={{ fill: '#333', opacity: 0.4 }}
                                />
                                <Bar dataKey="value" fill="#F40009" radius={[4, 4, 0, 0]}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={RED_COLORS[index % RED_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
            <Card className="bg-suku-surface border-suku-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white">Recent Users</CardTitle>
                        <CardDescription className="text-gray-400">Latest platform registrations</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8 bg-suku-black border-suku-border text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-suku-black/50">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Joined</th>
                                    <th className="px-6 py-3">Last Login</th>
                                    <th className="px-6 py-3">Credits Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-suku-border hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-suku-red text-white text-xs">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-white">{user.firstName} {user.lastName}</div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                                                {user.totalCreditsUsed}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
