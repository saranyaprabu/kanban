Overview

The Task Management Dashboard enables users to organize tasks in a Kanban-style interface. Users can:
•	View tasks categorized in columns (To Do, In Progress, Done).
•	Add new tasks to the board.
•	Move tasks between different columns.
•	Perform CRUD operations to manage tasks (fetching, adding, updating, and deleting tasks).
This project is built using React.js, styled with Bootstrap, and utilizes json-server to simulate backend interactions.

Setup Instructions

1.	Clone the Repository
Clone this repository to your local machine:
 **git clone https://github.com/saranyaprabu/kanban.git**
  	
2.	Download the Master File
Alternatively, you can go to the repository's master branch and click on the Code button, then select Download ZIP. After downloading, extract the ZIP file to your local machine.

4.	Install Dependencies
Navigate to the project directory and install the necessary dependencies:
**cd kanban-master**

5.	Start the Server
Run the following command to start the mock API server using json-server:
**json-server --watch db.json --port 3001**
This will start the server at http://localhost:3001.


6.	Start the Frontend
Install the necessary frontend dependencies and start the React app:
**npm install
npm start**
The app will open in your browser at http://localhost:3000.
