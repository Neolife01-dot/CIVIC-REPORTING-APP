const reportForm = document.getElementById("reportForm");
const gpsBtn = document.getElementById("gpsBtn");

const API_URL = "https://civic-reporting-app-1.onrender.com";

// ===============================
// GPS LOCATION
// ===============================

gpsBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    gpsBtn.textContent = "📍 Getting location...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById("location").value =
                `${latitude}, ${longitude}`;

            gpsBtn.textContent = "📍 Location Captured";
        },

        (error) => {

            console.error("GPS Error:", error);

            gpsBtn.textContent = "📍 Use Current Location";

            alert("Could not get your location. Please enter it manually.");
        }
    );
});


// ===============================
// SUBMIT REPORT
// ===============================

reportForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitBtn = document.querySelector(".submit-btn");

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const imageInput = document.getElementById("image");

    // Validate fields
    if (!title || !category || !description || !location) {

        alert("Please complete all required fields.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

        let imagePath = null;


        // ===============================
        // STEP 1: UPLOAD IMAGE
        // ===============================

        if (imageInput.files.length > 0) {

            console.log("1. Uploading image...");

            const formData = new FormData();

            formData.append(
                "image",
                imageInput.files[0]
            );

            const uploadResponse = await fetch(
                `${API_URL}/api/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            console.log(
                "Upload response:",
                uploadResponse.status
            );

            const uploadText = await uploadResponse.text();

            console.log(
                "Upload result:",
                uploadText
            );

            if (!uploadResponse.ok) {

                throw new Error(
                    "Image upload failed: " + uploadText
                );
            }

            let uploadData;

            try {
                uploadData = JSON.parse(uploadText);
            } catch {
                throw new Error(
                    "Server returned an invalid image upload response."
                );
            }

            imagePath = uploadData.image;

            console.log(
                "2. Image uploaded successfully:",
                imagePath
            );
        }


        // ===============================
        // STEP 2: CREATE REPORT
        // ===============================

        console.log("3. Sending report to server...");

        const reportResponse = await fetch(
            `${API_URL}/api/reports`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: 1,

                    title: title,

                    description: description,

                    category: category,

                    location: location,

                    image: imagePath

                })
            }
        );


        console.log(
            "Report response:",
            reportResponse.status
        );


        const reportText =
            await reportResponse.text();


        console.log(
            "Report result:",
            reportText
        );


        if (!reportResponse.ok) {

            throw new Error(
                "Report submission failed: " + reportText
            );
        }


        let reportData;

        try {

            reportData =
                JSON.parse(reportText);

        } catch {

            throw new Error(
                "Server returned an invalid report response."
            );
        }


        console.log(
            "4. Report submitted successfully:",
            reportData
        );


        // ===============================
        // SUCCESS
        // ===============================

        alert(
            "✅ Report submitted successfully!"
        );


        reportForm.reset();

        gpsBtn.textContent =
            "📍 Use Current Location";


    } catch (error) {

        console.error(
            "REPORT ERROR:",
            error
        );

        alert(
            "❌ " + error.message
        );


    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
            "Submit Report";
    }

});