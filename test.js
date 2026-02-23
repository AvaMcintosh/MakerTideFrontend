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

//Calls homepage
app.get("/", (req, res) => {
    res.render("index");
});




//When we add database this should call data from database
//Grabs the project data and adds them to the project cards 
app.get('/projectsData', (req, res) => {
    res.json(projects);
});

//Calls project page 
app.get("/projects", async (req, res) => {
    //This is where we want to get the project objects from the database,
    // but for now we will just use the example projects array (The function above is what is populating object data))
    //const projects = await getProjectsFromDatabase(); 
    

    res.render("project_page", {
        
        user: req.session.user
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
    res.render("project_details", {
        user: req.session.user
    });
});

//This gets the correct project data for the project details page 
app.get("/projectsData/:id", (req, res) => {
    const projectId = parseInt(req.params.id);

    console.log("Requested project ID:", projectId);

    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



