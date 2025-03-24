import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import StudentsList from "./pages/StudentsList";
import CreateStudent from "./pages/CreateStudents";
import StudentInfo from "./pages/StudentInfo";

const drawerWidth = 240; // Ancho de la barra lateral

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar (Drawer) */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="students/">
                <ListItemText primary="Listado" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="students/new">
                <ListItemText primary="Crear Estudiante" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Contenido Principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="students/" element={<StudentsList />} />
            <Route path="students/new" element={<CreateStudent />} />
            <Route path="students/:id" element={<StudentInfo />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
