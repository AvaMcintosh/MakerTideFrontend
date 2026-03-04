const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

//unique session for user
app.use(session({
    secret: "supersecretkey", // any random string
    resave: false,
    saveUninitialized: true,   // make sure session exists
}));

//Use the ejs templates
app.set("view engine", "ejs");
// Default views folder
app.set("views", path.join(__dirname, "views"));

// For POST requests, (TODO)
app.use(express.urlencoded({ extended: true })); // For form POST requests

// Tell Express to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

//Sets user to default null if no user
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // null if no user
    next();
});

const users = [{ email: "ava@example.com", password: "1234", fname: "Ava", lname: "Smith" },
{ email: "bob@example.com", password: "abcd", fname: "Bob", lname: "Name" }];

const bids = []; // Example bid storage, replace with database in production
// Example Project Templates
const projects = [
    {
        id: 1,
        image: "/images/3dDragon.jpg",
        title: "Dragon",
        category: "3D Printing",
        description: "I want a 3D printed dragon",
        location: "Dayton, OH",
        budget: "$500",
        deadline: "2026-03-01",
        quantity: 1,
        user: "Ava"
    },
    {
        id: 2,
        image: "/images/3DPrinting.jpg",
        title: "Logo Design",
        category: "3D Printing",
        description: "Modern minimalist logo needed.",
        location: "Remote",
        budget: "$200",
        deadline: "2026-02-28",
        quantity: 3,
        user: "John"
    },
    {
        id: 3,
        image: "/MakerTideFrontend/MakerTideFrontend/images/3DPrinting.jpg",
        title: "Example 3",
        category: "3D Printing",
        description: "Modern minimalist logo needed.",
        location: "Remote",
        budget: "$200",
        deadline: "2026-02-28",
        quantity: 3,
        user: "John"
    },
    {
        id: 4,
        image: "/MakerTideFrontend/MakerTideFrontend/images/3DPrinting.jpg",
        title: "Example 4",
        category: "3D Printing",
        description: "Modern minimalist logo needed.",
        location: "Remote",
        budget: "$200",
        deadline: "2026-02-28",
        quantity: 3,
        user: "John"
    }
];

//Renders homepage
app.get("/", (req, res) => {
    res.render("index");
});

//renders signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

//renders login page
app.get("/login", (req, res) => {
    res.render("login");
});


//Will be able to remove this in the future and move it into /projects function
// app.get('/projectsData', (req, res) => {
//     res.json(projects);
// });

//Calls project page 
app.get("/projects", (req, res) => {
    const selectedCategories = req.query.category;

    let filteredProjects = projects;

    if (selectedCategories) {
        const categoriesArray = Array.isArray(selectedCategories)
            ? selectedCategories
            : [selectedCategories];

        filteredProjects = projects.filter(project =>
            categoriesArray.includes(project.category)
        );
    }

    res.render("project_page", {
        user: req.session.user,
        projects: filteredProjects,
        selectedCategories: selectedCategories || []
    });
});


//Renders the post a project page
app.get("/post", async (req, res) => {

    res.render("post_a_project", {

        user: req.session.user
    });
});


//calls project details page 
app.get("/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).send("Project not found");
    }

    res.render("project_details", {
        user: req.session.user,
        project: project
    });
});


//renders the form based on the category the user picked
app.get("/post/:category", (req, res) => {
    const category = req.params.category;
    res.render("forms", { category });
});

//When a user submits new project this creates the project object and sends it to databse
app.post("/projects", (req, res) => {
    const { title, category, description, location, budget, image, deadline, quantity } = req.body;
    const newProject = {
        id: projects.length + 1, // ID, proably change this so database handles id increment
        title,
        category,
        description,
        location,
        budget,
        image,
        deadline,
        quantity,
        owner: req.session.user ? req.session.user.username : "Anonymous" // Assuming user object has a username
    };
    console.log("New project data:", newProject); // Log the new project data
    //Here is where you will add the project to the database
});

//When a user submits a bid on a project this creates the bid project
app.post('/submitBid', (req, res) => {
    const { projectId, bidAmount, message, owner } = req.body;
    const newBid = {
        bidId: bids.length + 1, // Unique ID for the bid, you can use a better method in production
        projectId,
        bidAmount,
        message,
        owner: req.session.user ? req.session.user.username : "Anonymous" // Assuming user object has a username
    };
    console.log("New Bid Data: ", newBid); // Log the incoming bid data

    //save bid to database
    res.redirect(`/projects`); // Redirect back to the project details page after submitting the bid
});

//When a user logins in this checks if they exist
app.post("/login", async (req, res) => {
    const { mail, pass } = req.body;

    //grabs from array rn
    const user = users.find(u => u.email === mail);

    // database example
    // const user = await User.findOne({ email: mail });

    if (!user) {
        return res.render("login", { error: "User not found" });
    }

    if (user.password !== pass) {
        return res.render("login", { error: "Invalid password" });
    }

    // Set session
    req.session.user = user;

    res.redirect("/projects"); // takes user to projects page
});

//When a user signs up creates new user
app.post("/createUser", (req, res) => {
    const { fname, lname, mail, pass } = req.body;

    // Check if email already exists
    const existingUser = users.find(user => user.email === mail);

    if (existingUser) {
        return res.render("signup", {
            error: "Email already exists"
        });
    }

    // Create new user object
    const newUser = {
        id: users.length + 1,
        firstName: fname,
        lastName: lname,
        email: mail,
        password: pass
    };

    // Add to array
    users.push(newUser);

    // Set session
    req.session.user = newUser;

    // Redirect to homepage
    res.redirect("/projects");
});



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



