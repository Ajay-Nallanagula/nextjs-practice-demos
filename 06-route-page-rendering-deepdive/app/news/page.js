import { DUMMY_NEWS } from "@/dummy-news";
import NewsList from "@/components/NewsList";

export default function NewsPage() {
    return (
        <div>
            <h1>News</h1>
            <p>This is the news page.</p>
            <NewsList news={DUMMY_NEWS} />
        </div>
    )
}