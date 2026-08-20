const API_URL = "https://civic-reporting-app-wsz2.onrender.com";

const tableBody = document.querySelector("tbody");


// Load reports from the backend
async function loadReports() {

    try {

        const response = await fetch(
            `${API_URL}/api/reports`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to load reports"
            );
        }


        // Clear existing sample reports
        tableBody.innerHTML = "";


        // Check if there are no reports
        if (!data.reports || data.reports.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No reports found.
                    </td>
                </tr>
            `;

            return;
        }


        // Display reports
        data.reports.forEach(report => {

            const row = document.createElement("tr");


            // Format date
            const date = new Date(
                report.created_at
            );

            const formattedDate =
                date.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            // Status class
            let statusClass = "pending";

            if (
                report.status === "resolved"
            ) {
                statusClass = "resolved";
            }

            else if (
                report.status === "in progress" ||
                report.status === "under review"
            ) {
                statusClass = "review";
            }


            row.innerHTML = `

                <td>
                    ${report.title}
                </td>

                <td>
                    ${report.category}
                </td>

                <td>
                    ${formattedDate}
                </td>

                <td>
                    <span class="${statusClass}">
                        ${report.status}
                    </span>
                </td>

                <td>
                    <button
                        onclick="viewReport(${report.id})"
                    >
                        View
                    </button>
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Error loading reports:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load reports.
                </td>
            </tr>
        `;
    }
}


// View report
async function viewReport(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/reports/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to load report"
            );
        }

        const report = data.report;

        alert(
            `REPORT DETAILS\n\n` +
            `Title: ${report.title}\n` +
            `Category: ${report.category}\n` +
            `Description: ${report.description}\n` +
            `Location: ${report.location}\n` +
            `Status: ${report.status}\n` +
            `Date: ${report.created_at}`
        );

    } catch (error) {

        console.error("Error loading report:", error);

        alert("Failed to load report details.");
    }
}


// Load reports when page opens
loadReports();