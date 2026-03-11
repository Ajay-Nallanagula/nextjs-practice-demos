export default function ArciveLayout({ archive, latest }) {
    return (
        <div>
            <div>
                {archive}
            </div>

            <hr />

            <div>
                {latest}
            </div>
        </div>
    )
}