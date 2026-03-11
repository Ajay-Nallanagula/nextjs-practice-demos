import NewsList from "@/components/NewsList";
import { getLatestNews } from "@/lib/news";

export default function LatestPage() {
    const news = getLatestNews(); // Assume this function fetches the latest news data
    return (
        <div>
            <h1>News</h1>
            <p>This is the Latest news page.</p>
            <NewsList news={news} />
        </div>
    )
}