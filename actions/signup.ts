"use server";

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { SignUpSchema } from "@/schemas/auth";
import { user } from "@/db/schema";
import db from "@/db";
import { redirect } from "next/navigation";

export const signUp = async (_: any, formData: FormData) => {
    // 1. validate Fields
    const validateFields = SignUpSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
        return {
            errorMessage: "잘못된 입력값이 있습니다.",
        };
    }

    // 2. 존재하는 사용자인지 체크
    const { email, name, password } = validateFields.data;

    // 4. 성공 실패 처리
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return {
                errorMessage: "이미 존재하는 사용자 입니다.",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. insert db
        await db.insert(user).values({ name, email, password: hashedPassword });
    } catch (error) {
        console.log(error);
        return { errorMessage: "문제가 발생했습니다." };
    }

    redirect("/login");
};
