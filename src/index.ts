import app from "./app";
import db from "./db";

// Ensure DB is connected
db.one("SELECT $1 AS value", 1234)
.then((data) => {
    // tslint:disable-next-line:rule no-console
    console.log("Database connection success:", data);
})
.catch((error) => {
    // tslint:disable-next-line:rule no-console
    console.log("Database connection failed:", error);
});

// Start app
const port = process.env.PORT || 3000;
app.listen(port, (error) => {
    if (error) {
        // tslint:disable-next-line:rule no-console
        console.error(error);
    } else {
        // tslint:disable-next-line:rule no-console
        console.log(`Server started on port ${port}`);
    }
});
