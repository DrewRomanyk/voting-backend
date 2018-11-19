import chalk from "chalk";

import app from "./app";

// Start app
const port = process.env.PORT || 3000;
app.listen(port, (error) => {
    if (error) {
        // tslint:disable-next-line:rule no-console
        console.error(error);
    } else {
        // tslint:disable-next-line:rule no-console
        console.log(chalk.greenBright(`Server started on port ${port}`));
    }
});
