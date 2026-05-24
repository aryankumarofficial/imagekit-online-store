// /auth/change-password

import {NextRequest, NextResponse} from "next/server";
import User, {changePassword} from "@/models/User";
import {withDatabase} from "@/lib/withDatabase";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

async function handler(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({message: "Unauthorized", success: false}, {status: 401});
    }

    const {email, password, newPassword} = await request.json();
    if (!email || !password || !newPassword) {
        return NextResponse.json({message: "Email, password, and new password are required", success: false}, {status: 400});
    }

    if (session.user.role !== "admin" && session.user.email.toLowerCase() !== String(email).toLowerCase()) {
        return NextResponse.json({message: "Forbidden", success: false}, {status: 403});
    }

    const result: changePassword = await User.changePassword(email, password, newPassword);
    if ((result.status === 200)) {
        return NextResponse.json({message: result.message, success: true, status: result.status});
    } else return NextResponse.json({message: result.message, success: false, status: result.status});
}

export const PUT = await withDatabase(handler);