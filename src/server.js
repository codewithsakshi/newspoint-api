const express = require("express")
const mysql = require("mysql")

const app = express();
app.use(express.json())



const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "newspoint"
})

const PORT = 3009

app.get("/ping", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    })
})

app.post("/user", (req,res) => {
    const data = req.body;
    console.log("data::" , data)
    const {firstName, lastName, email, password, id} = data
    const newUser = {firstName, lastName, email, password, id}
    if(!firstName || !lastName || !email || !password || !id) {
        return res.status(400).json({
            message: "BAD REQUEST"
        })
    }

    connection.query(`INSERT INTO user SET ?`, newUser, (err, results, fields) => {
        if(err) {
            console.error(err)
            return res.status(500).json({
                message: "Failed to Create users from database"
            })
        }
        const data = JSON.parse(JSON.stringify(results))
        console.log(results)
        if(results.affectedRows == 1) {
            res.status(200).json({message: "user created successfully"})        
        } else {
            res.status(500).json({message: "failed to create record in database"})        

        }

    })
    //

    // res.status(200).json({message: "User created successfully"})
})

app.get("/users", (req, res) => {
    // const users = []
    connection.query(`SELECT * from user`, (err, results, fields) => {
        if(err) {
            console.error(err)
            return res.status(500).json({
                message: "Failed to read users from database"
            })
        }
        const data = JSON.parse(JSON.stringify(results[0]))
        console.log(results[0])
        res.status(200).json({users: data})
    });

})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))