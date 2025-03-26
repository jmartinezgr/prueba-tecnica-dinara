import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import StudentsList from "./pages/StudentsList";
import CreateStudent from "./pages/CreateStudents";
import StudentInfo from "./pages/StudentInfo";
import CoursesList from "./pages/CoursesList";
import CourseInfo from "./pages/CourseInfo";
import InscribeStudent from "./pages/InscribeStudent";
import InscriptionsList from "./pages/InscriptionsList";
import CourseForm from "./pages/CreateCourse";

const drawerWidth = 240; // Ancho de la barra lateral

function App() {
  const [openStudents, setOpenStudents] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openInscriptions, setOpenInscriptions] = useState(false);

  const handleClickStudents = () => {
    setOpenStudents(!openStudents);
  };

  const handleClickCourses = () => {
    setOpenCourses(!openCourses);
  };

  const handleClickInscriptions = () => {
    setOpenInscriptions(!openInscriptions);
  };

  return (
    <Router>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar (Drawer) */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <List>
            {/* Dropdown de Estudiantes */}
            <ListItemButton onClick={handleClickStudents}>
              <ListItemText primary="Estudiantes" />
              {openStudents ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStudents} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="students/"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Ver Estudiantes" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="students/new"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Crear Estudiante" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Dropdown de Cursos */}
            <ListItemButton onClick={handleClickCourses}>
              <ListItemText primary="Cursos" />
              {openCourses ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCourses} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="courses/"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Ver Cursos" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="courses/new"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Crear Curso" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Dropdown de Inscripciones (momentáneo) */}
            <ListItemButton onClick={handleClickInscriptions}>
              <ListItemText primary="Inscripciones" />
              {openInscriptions ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openInscriptions} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="inscriptions/"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Ver Inscripciones" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="inscriptions/new"
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Inscribir" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Drawer>

        {/* Contenido Principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* Rutas de Estudiantes */}
            <Route path="/" element={<StudentsList />} />
            <Route path="students/" element={<StudentsList />} />
            <Route path="students/new" element={<CreateStudent />} />
            <Route path="students/:id" element={<StudentInfo />} />

            {/* Rutas de Cursos */}
            <Route path="courses/" element={<CoursesList />} />
            <Route path="courses/new" element={<CourseForm key={"new"}/>} />
            <Route path="courses/:id" element={<CourseInfo />} />
            <Route path="/courses/edit/:id" element={<CourseForm key={"edit"}/>} />

            {/* Rutas de Inscripciones (momentáneas) */}
            <Route path="inscriptions/" element={<InscriptionsList/>} />
            <Route path="inscriptions/new" element={<InscribeStudent/>} />
          </Routes>
        </Box>  
      </Box>
    </Router>
  );
}

export default App; 