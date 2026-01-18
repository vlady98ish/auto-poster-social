import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback className="bg-zinc-700 text-white text-xl">
                {session?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{session?.user?.name}</p>
              <p className="text-sm text-zinc-400">{session?.user?.email}</p>
              <Badge className="mt-2" variant="secondary">
                Google Account
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-zinc-400">Receive updates about your posts</p>
            </div>
            <Badge variant="outline" className="text-zinc-500">
              Coming soon
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Auto-retry Failed Posts</p>
              <p className="text-sm text-zinc-400">Automatically retry failed publications</p>
            </div>
            <Badge variant="outline" className="text-zinc-500">
              Coming soon
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
