import { getAvailableNewsYears } from "@/lib/news";
import Link from "next/link";

export default function ArchivePage() {
    const years = getAvailableNewsYears(); // Assume this function fetches available years for news archives
    return (
        <div>
            <h1>Archive Page</h1>
            <ul style={{display: 'flex', gap: '20px', listStyle: 'none', padding: 0}}>
                {years.map(year => (
                    <li key={year}>
                        <Link href={`/archive/${year}`}>{year}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}