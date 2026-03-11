# MakerTideFrontend

TODO: 

- Post a Project page category cards need design updates

- Forms Page needs update design
 
- Projects Page project cards need design updates (The boxes are different sizes for different images)

- Projects page search box needs design updates and needs to be implemented

- Project Details Page needs design update


- Add a check if the user doesn't exist when they post a project

- Bid button design change



Notes:

1. http://localhost:8080/api/projects → Change to your Spring Boot server URL.

2. Make sure Content-Type: application/json is set (axios does it automatically).

3. The DTO defines what fields your Spring Boot backend expects; match those exactly.


`const axios = require("axios");

app.post("/projects", async (req, res) => {
    const { title, category, description, location, budget, image, deadline, quantity } = req.body;

    const newProject = {
        title,
        category,
        description,
        location,
        budget,
        image,
        deadline,
        quantity,
        owner: req.session.user ? req.session.user.username : "Anonymous"
    };

    try {
        const response = await axios.post("http://localhost:8080/api/projects", newProject);
        res.status(201).json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add project" });
    }
});`


DONE: 

- Project Details Page needs bid button

- Projects Page needs bid button implementation


