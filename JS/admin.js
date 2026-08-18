const API_URL = "http://localhost:5000";

const reportsTable = document.getElementById("reportsTable");


// Load all reports
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

        const reports = data.reports || [];


        // Statistics

        document.getElementById("totalReports").textContent =
            reports.length;

        document.getElementById("pendingReports").textContent =
            reports.filter(
                report => report.status === "pending"
            ).length;

        document.getElementById("reviewReports").textContent =
            reports.filter(
                report =>
                    report.status === "under review" ||
                    report.status === "in progress"
            ).length;

        document.getElementById("resolvedReports").textContent =
            reports.filter(
                report => report.status === "resolved"
            ).length;


        // Empty state

        if (reports.length === 0) {

            reportsTable.innerHTML = `
                <tr>
                    <td colspan="8">
                        No reports found.
                    </td>
                </tr>
            `;

            return;
        }


        // Clear table

        reportsTable.innerHTML = "";


        // Display reports

        reports.forEach(report => {

            const row = document.createElement("tr");


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


            let imageHTML = "No image";

            if (report.image) {

                imageHTML = `
                    <img
                        src="${API_URL}${report.image}"
                        class="report-image"
                        alt="Report image"
                    >
                `;

            }


            row.innerHTML = `

                <td>${report.id}</td>

                <td>
                    <strong>${report.title}</strong>
                </td>

                <td>
                    ${report.category}
                </td>

                <td>
                    ${report.location}
                </td>

                <td>
                    ${formattedDate}
                </td>

                <td>

                    <select
                        class="status-select"
                        onchange="updateStatus(
                            ${report.id},
                            this.value
                        )"
                    >

                        <option
                            value="pending"
                            ${report.status === "pending" ? "selected" : ""}
                        >
                            Pending
                        </option>

                        <option
                            value="under review"
                            ${report.status === "under review" ? "selected" : ""}
                        >
                            Under Review
                        </option>

                        <option
                            value="in progress"
                            ${report.status === "in progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>

                        <option
                            value="resolved"
                            ${report.status === "resolved" ? "selected" : ""}
                        >
                            Resolved
                        </option>

                    </select>

                </td>

                <td>
                    ${imageHTML}
                </td>

                <td>

                    <button
                        onclick="viewReport(${report.id})"
                    >
                        View
                    </button>

                </td>

            `;


            reportsTable.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Error loading reports:",
            error
        );

        reportsTable.innerHTML = `
            <tr>
                <td colspan="8">
                    Failed to load reports.
                </td>
            </tr>
        `;

    }

}


// Update status

async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `${API_URL}/api/reports/${id}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Failed to update status"
            );

        }


        alert("Report status updated successfully!");

        loadReports();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to update report status."
        );

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

        alert(`
REPORT DETAILS

Title: ${report.title}

Category: ${report.category}

Description:
${report.description}

Location:
${report.location}

Status:
${report.status}

Date:
${report.created_at}
        `);

    } catch (error) {

        alert(
            "Unable to load report details."
        );

        console.error(error);

    }

}


// Start dashboard

loadReports();