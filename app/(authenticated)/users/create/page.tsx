// app/(authenticated)/users/create/page.tsx
"use client";

import { UserForm } from '@/components/users/UserForm';
import { UserData } from '@/components/users/UserTableRow'; // Use shared type
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthorizationGuard } from '@/components/auth/AuthenticationGuard';
import Link from 'next/link';
import { ArrowLeft } from 'phosphor-react';
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button';
import { PageHeader } from '@/components/layout/auth/page-header';

export default function CreateUserPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleCreateUser = async (data: Omit<UserData, 'id' | 'joinDate'>) => {
        setIsSubmitting(true);
        console.log("Creating user with data:", data);
        try {
            // TODO: Replace with actual API call / Redux dispatch for creating user
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            // const newUser = await dispatch(createUser(data)).unwrap(); // Example Redux
            toast.success(`User "${data.name}" created successfully!`);
            router.push('/users'); // Redirect to users list after creation
        } catch (error: any) {
            console.error("Failed to create user:", error);
            toast.error(`Failed to create user: ${error?.message || 'Unknown error'}`);
            setIsSubmitting(false); // Only set false on error if not redirecting
        }
        // No need to set submitting false if redirecting on success
    };

    return (
        <AuthorizationGuard allowedRoles={['admin']}>
            <div className="mx-auto">
                <PageHeader
                    heading={`Create User`}
                />

                <UserForm
                    onSubmit={handleCreateUser}
                    isSubmitting={isSubmitting}
                    mode="create"
                />
            </div>
        </AuthorizationGuard>
    );
}