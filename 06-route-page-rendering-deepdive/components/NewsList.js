import Link from "next/link";

export default function NewsList({ news }) {
    return (
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0 }}>
            {news.map((newsItem) => (
                <li key={newsItem.id}>
                    <Link href={`/news/${newsItem.id}`}>
                        <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} width={200} />
                    </Link>
                </li>
            ))}
        </ul>
    );
}