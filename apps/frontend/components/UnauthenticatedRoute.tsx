"use client";

import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const UnauthenticatedRoute = ({ children }: { children: React.ReactNode }) => {

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/menu");
        }
    }, [user, router]);

    if (user) {
        return null;
    }

    return <>{children}</>

}
export default UnauthenticatedRoute;