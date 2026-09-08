import app from "./app.js";


 app.listen(process.env.PORT || 4000, () => {
    console.log("server-started", process.env.PORT);

})