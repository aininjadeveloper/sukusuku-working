import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [, navigate] = useLocation();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiRequest("POST", "/api/admin/login", { password });
            toast({
                title: "Welcome Admin",
                description: "Successfully logged in to admin panel",
            });
            navigate("/admin/dashboard");
        } catch (error) {
            toast({
                title: "Access Denied",
                description: "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-suku-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-suku-surface border-suku-border">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-suku-red/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-suku-red" />
                    </div>
                    <CardTitle className="text-white text-2xl">Admin Access</CardTitle>
                    <CardDescription className="text-gray-400">
                        Please enter your administrative credentials
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-suku-black border-suku-border text-white"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-suku-red hover:bg-red-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Access Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
