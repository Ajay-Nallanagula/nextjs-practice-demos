import { DUMMY_NEWS } from "@/dummy-news";
import Link from "next/link";
import { use } from "react";

export default function NewsDetailsPage(props) {
    const params = use(props.params);
    const { newsSlug } = params;
    const newsItem = DUMMY_NEWS.find((news) => news.id === newsSlug);
    return (
        <div>
            <h1>News Details</h1>

            <h3>News Id: {newsSlug} </h3>

            {newsItem && (
                <article>
                    <h2>{newsItem.title}</h2>
                    <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} width={400} />
                    <p>{newsItem.content}</p>
                </article>
            )}
        </div>
    )
}