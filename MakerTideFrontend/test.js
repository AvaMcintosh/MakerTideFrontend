const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Tell Express to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'MakerTideFrontend')));


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


//When we add database this should call data from database
//Grabs the project data and adds them to the project cards 
app.get('/projectsData', (req, res) => {
    res.json(projects);
});

//Grabs project data based on id for project details page
app.get('/project/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return res.send("Project not found");
    }

    res.sendFile(path.join(__dirname, 'MakerTideFrontend', '/ProjectPages/project_detials.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



