import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  TableFooter,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TableView = () => {
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-based indexing
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Store ID of the user to delete
  const navigate = useNavigate();

  const fetchUsers = async (page = 0, size = 10, search = "", sortBy = "id", sortDir = "asc") => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users?page=${page + 1}&size=${size}&search=${search}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      const data = await response.json();

      setUsers(data.users || []);
      setTotalItems(data.totalItems || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchQuery, sortBy, sortDir);
  }, [currentPage, pageSize, searchQuery, sortBy, sortDir]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(0); // Reset page on new search
    fetchUsers(0, pageSize, searchQuery, sortBy, sortDir);
  };

  const handleSortChange = (field) => {
    const direction = sortBy === field && sortDir === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortDir(direction);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to the first page
  };

  const openDeleteDialog = (id) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${selectedUserId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers(currentPage, pageSize, searchQuery, sortBy, sortDir); // Refresh users after deletion
        closeDeleteDialog();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to edit page with user id
  };

  return (
    
    <div   className="Table-view" style={{ padding: "20px", textAlign: "center", fontFamily: "bold"}}>
      <Typography variant="h4" gutterBottom>
        User Table
      </Typography>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search field"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: "8px", marginRight: "10px", width: "250px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSearchSubmit}>
          Search
        </Button>
      </div>

      <TableContainer component={Paper} style={{ maxWidth: "60%", margin: "0 auto" }}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSortChange("name")}>
                Name {sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSortChange("description")}>
                Description {sortBy === "description" && (sortDir === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSortChange("gender")}>
                Gender {sortBy === "gender" && (sortDir === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSortChange("country")}>
                Country {sortBy === "country" && (sortDir === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSortChange("dateOfBirth")}>
                Date of Birth {sortBy === "dateOfBirth" && (sortDir === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.description}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.dateOfBirth}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(user.id)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => openDeleteDialog(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={totalItems}
                page={currentPage}
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
  );
};

export default TableView;
