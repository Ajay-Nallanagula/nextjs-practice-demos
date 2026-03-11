import NewsList from "@/components/NewsList";
import { getNewsForYear } from "@/lib/news";
import { use } from "react";

export default function ArchivedYearPage(props) {
    const params = use(props.params);
    const year = params.year; // Extract the year from the route parameters
    const newsPerYear = getNewsForYear(year); // Fetch news items for the specified year
    return (
        <div>
            <div>
                <h1>News</h1>
                <p>This is the news page.</p>
                <NewsList news={newsPerYear} />
            </div>
        </div>
    );
}