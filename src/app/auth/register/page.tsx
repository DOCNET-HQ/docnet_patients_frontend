import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register | Patient Dashboard',
    description: 'Create a new account',
}

export default function RegisterPage() {
    return <RegisterForm />
}
