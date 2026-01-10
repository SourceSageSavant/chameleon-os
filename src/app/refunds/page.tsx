import { redirect } from 'next/navigation';

// Refund policy is the same as returns, so redirect there
export default function RefundsPage() {
    redirect('/returns');
}
