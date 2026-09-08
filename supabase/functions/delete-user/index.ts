import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
};

Deno.serve(async (req:any) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {
        const supabaseUrl =
            Deno.env.get("SUPABASE_URL")!;

        const serviceRoleKey =
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        const anonKey =
            Deno.env.get("SUPABASE_ANON_KEY")!;

        // Get authenticated user
        const authHeader =
            req.headers.get("Authorization");

        if (!authHeader) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing authorization",
                }),
                {
                    status: 401,
                    headers: corsHeaders,
                }
            );
        }

        // Service-role client
        const supabase = createClient(
            supabaseUrl,
            serviceRoleKey
        );

        // User client
        const userClient = createClient(
            supabaseUrl,
            anonKey,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            }
        );

        // Get current logged-in user
        const {
            data: { user: admin },
            error: authError,
        } = await userClient.auth.getUser();

        if (authError || !admin) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: corsHeaders,
                }
            );
        }

        // Get target user ID
        const { userId } = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "userId is required",
                }),
                {
                    status: 400,
                    headers: corsHeaders,
                }
            );
        }

        // Prevent deleting yourself
        if (admin.id === userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "You cannot delete your own account.",
                }),
                {
                    status: 400,
                    headers: corsHeaders,
                }
            );
        }

        // Verify current user is admin
        const { data: adminProfile, error: adminProfileError } =
            await supabase
                .from("profiles")
                .select("role")
                .eq("id", admin.id)
                .single();

        if (
            adminProfileError ||
            adminProfile?.role !== "admin"
        ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "Only administrators can delete users.",
                }),
                {
                    status: 403,
                    headers: corsHeaders,
                }
            );
        }

        // Delete profile
        const { error: profileDeleteError } =
            await supabase
                .from("profiles")
                .delete()
                .eq("id", userId);

        if (profileDeleteError) {
            throw profileDeleteError;
        }

        // Delete Supabase Auth user
        const { error: authDeleteError } =
            await supabase.auth.admin.deleteUser(
                userId
            );

        if (authDeleteError) {
            throw authDeleteError;
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User deleted successfully.",
            }),
            {
                status: 200,
                headers: corsHeaders,
            }
        );
    } catch (error) {
        console.error("Delete user error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete user.",
            }),
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
});