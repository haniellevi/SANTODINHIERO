import { getUserSettings, getUserPlan } from "@/lib/queries/settings";
import { GeneralSettings } from "@/components/settings/general-settings";
import { CollaboratorsSettings } from "@/components/settings/collaborators-settings";
import { SupportSettings } from "@/components/settings/support-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { Settings, Users, HelpCircle } from "lucide-react";

export default async function SettingsPage() {
    const userSettings = await getUserSettings();
    const userPlan = await getUserPlan();

    if (!userSettings) {
        redirect("/sign-in");
    }

    const maxCollaborators = userPlan?.maxCollaborators || 0;

    return (
        <div className="container max-w-4xl py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie suas preferências e equipe.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="collaborators" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Colaboradores
                    </TabsTrigger>
                    <TabsTrigger value="support" className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Suporte
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <GeneralSettings
                        initialData={{
                            isTitheEnabled: userSettings.isTitheEnabled,
                            planningAlertDays: userSettings.planningAlertDays
                        }}
                    />
                </TabsContent>

                <TabsContent value="collaborators">
                    <CollaboratorsSettings
                        collaborators={userSettings.collaborators.map(c => ({
                            id: c.id,
                            email: c.email,
                            status: c.status,
                            permission: c.permission,
                            user: c.user ? { name: c.user.name, image: null } : null // Image not in schema yet, passing null
                        }))}
                        maxCollaborators={maxCollaborators}
                    />
                </TabsContent>

                <TabsContent value="support">
                    <SupportSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
