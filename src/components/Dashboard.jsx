import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/Dashboard.css";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [, setContactActionType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const taskStatuses = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:3001/task")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  const getTitleFromId = (id) => {
    const column = columns.find((col) => col.id === id);
    return column ? column.title : "";
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = getTitleFromId(destination.droppableId);

    axios
      .patch(`http://localhost:3001/task/${draggableId}`, {
        status: newStatus,
      })
      .then(() => {
        fetchTasks();
      })
      .catch((err) => {
        console.error("Failed to update status", err);
      });
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setCurrentTask({});
    setShowAddModal(true);
  };

  const handleDeleteClick = (task) => {
    setCurrentTask(task);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    if (!currentTask.title) {
      setErrorMessage("Title should not be empty!");
      return;
    }
    setErrorMessage("");

    axios
      .patch(`http://localhost:3001/task/${currentTask.id}`, {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
      })
      .then(() => {
        fetchTasks();
        setShowSuccessModal(true);
        setActionMessage("Task Edited Successfully");
        setContactActionType("edit");
        setShowEditModal(false);
      })
      .catch((err) => console.error("Failed to update task", err));
  };

  const handleAddTask = () => {
    if (!currentTask.title) {
      setErrorMessage("Title should not be empty!");
      return;
    }
    setErrorMessage("");

    axios
      .post("http://localhost:3001/task", {
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status || "To Do",
      })
      .then(() => {
        fetchTasks();
        setShowSuccessModal(true);
        setActionMessage("Task Added Successfully");
        setContactActionType("add");
        setShowAddModal(false);
      })
      .catch((err) => console.error("Failed to add task", err));
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/task/${currentTask.id}`)
      .then(() => {
        fetchTasks();
        setShowSuccessModal(true);
        setActionMessage("Task Deleted Successfully");
        setContactActionType("delete");
        setShowDeleteModal(false);
      })
      .catch((err) => console.error("Failed to delete task", err));
  };

  return (
    <div className="kanban-board-container">
      <div className="dashboard-toolbar">
        <h1 className="dashboard-heading">Task Management Dashboard</h1>
        <button
          className="add-task-button btn btn-primary"
          onClick={handleAddClick}
        >
          Add New Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{col.title}</h2>
                  {getTasksByStatus(col.title).length === 0 ? (
                    <p style={{ textAlign: "center", fontSize: "20px" }}>
                      No tasks found
                    </p>
                  ) : (
                    getTasksByStatus(col.title).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div className="task-actions">
                              <Link
                                onClick={() => handleEditClick(task)}
                                className="custom-btn mx-1"
                              >
                                <img
                                  src="icons/edit-1.png"
                                  alt="Edit"
                                  className="action-icon-edit"
                                />
                              </Link>
                              <Link
                                onClick={() => handleDeleteClick(task)}
                                className="custom-btn mx-1"
                              >
                                <img
                                  src="icons/remove-1.png"
                                  alt="Delete"
                                  className="action-icon-delete"
                                />
                              </Link>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header className="modal-header-center" closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{actionMessage}</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className=" modal-header justify-content-center"
        >
          <Modal.Title className="w-100 text-center">Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="no-border-table">
            <tbody>
              <tr>
                <td>
                  <Form.Label>
                    Title <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={currentTask.title || ""}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, title: e.target.value })
                    }
                  />
                  {errorMessage && (
                    <div className="error-text">{errorMessage}</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Description</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={currentTask.description || ""}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        description: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Status</Form.Label>
                </td>
                <td>
                  <Form.Control
                    as="select"
                    value={currentTask.status || "To Do"}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, status: e.target.value })
                    }
                  >
                    {taskStatuses.map((status, i) => (
                      <option key={i} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button onClick={handleSave} variant="primary">
            Save
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header
          closeButton
          className="modal-header justify-content-center"
        >
          <Modal.Title className="w-100 text-center">Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="no-border-table">
            <tbody>
              <tr>
                <td>
                  <Form.Label>
                    Title<span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={currentTask.title || ""}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, title: e.target.value })
                    }
                  />
                  {errorMessage && (
                    <div className="error-text">{errorMessage}</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Description</Form.Label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={currentTask.description || ""}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        description: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Status</Form.Label>
                </td>
                <td>
                  <Form.Control
                    as="select"
                    value={currentTask.status || "To Do"}
                    onChange={(e) =>
                      setCurrentTask({ ...currentTask, status: e.target.value })
                    }
                  >
                    {taskStatuses.map((status, i) => (
                      <option key={i} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button onClick={handleAddTask} variant="primary">
            Add
          </Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className="modal-header justify-content-center"
        >
          <Modal.Title className="w-100 text-center">Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          Are you sure you want to delete this task?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
