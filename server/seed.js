import 'dotenv/config';
import db from './db.js';

const categories = [
  { name: 'Electrical/Systems', color: '#3b82f6' },
  { name: 'Mechanical/Engine',  color: '#f59e0b' },
  { name: 'Carpentry/Interior', color: '#8b5cf6' },
  { name: 'Paint/Finishes',     color: '#ec4899' },
  { name: 'Fiberglass/Hull',    color: '#10b981' },
  { name: 'Canvas/Enclosure',   color: '#f97316' },
];

const crew = [
  { name: 'Jack', role: 'Fiberglass/Paint', phone: '', email: '' },
  { name: 'Charlie', role: 'Carpentry/Paint', phone: '', email: '' },
  { name: 'Perry', role: 'Engine/Electric', phone: '', email: '' },
];

const tasks = [
  { id: 1,  task: 'Zincs for Grounding',               category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'high' },
  { id: 2,  task: 'Bonding Wire',                       category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'high' },
  { id: 3,  task: 'Engine Home Run',                    category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'high' },
  { id: 4,  task: 'Back of Helm Panel',                 category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 5,  task: 'Helm Dashboard',                     category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 6,  task: 'Fuel Gage',                          category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 7,  task: 'Recondition Gages',                  category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'low' },
  { id: 8,  task: 'Engine Controllers',                 category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 9,  task: 'Hydraulics for Rudder',              category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'high' },
  { id: 10, task: 'Control Head for Remote Control',    category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 11, task: 'Inverter and Batteries',             category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'high' },
  { id: 12, task: 'Recess Lighting',                    category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'low' },
  { id: 13, task: 'Outlets',                            category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'low' },
  { id: 14, task: 'Starlink',                           category: 'Electrical/Systems',  assigned: 'Perry',   priority: 'medium' },
  { id: 15, task: 'Air Conditioning',                   category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'high' },
  { id: 16, task: 'Inverter',                           category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 17, task: 'Vacuflush Toilet',                   category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'high' },
  { id: 18, task: 'Propane Stovetop',                   category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 19, task: 'Fridge',                             category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 20, task: 'Freezer',                            category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 21, task: 'Wine Fridge and Ice Maker',          category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'low' },
  { id: 22, task: 'Sinks Kitchen',                      category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 23, task: 'Sinks Heads',                        category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'medium' },
  { id: 24, task: 'Sink Helm',                          category: 'Mechanical/Engine',   assigned: 'Perry',   priority: 'low' },
  { id: 25, task: 'Drawers & Cabinets (Salon)',         category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 26, task: 'Hinges',                             category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'low' },
  { id: 27, task: 'Header Material & Batons',           category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 28, task: 'Countertops',                        category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 29, task: 'Formica for the Head',               category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 30, task: 'Forward Head — Replace Rot',         category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'high' },
  { id: 31, task: 'Forward Head Overhead',              category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 32, task: 'Prime Head Ply',                     category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 33, task: 'Flooring',                           category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 34, task: 'Galley Backsplash',                  category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'low' },
  { id: 35, task: 'Helm Hatch',                         category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 36, task: 'Helm Doors',                         category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'medium' },
  { id: 37, task: 'Valence for Helm Wiper Area',        category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'low' },
  { id: 38, task: 'Ladder (and extension)',              category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'low' },
  { id: 39, task: 'Rebed the Fly Console',              category: 'Carpentry/Interior',  assigned: 'Charlie', priority: 'high' },
  { id: 40, task: 'Painting Walls',                     category: 'Paint/Finishes',      assigned: 'Charlie', priority: 'medium' },
  { id: 41, task: 'Forward Head Paint',                 category: 'Paint/Finishes',      assigned: 'Charlie', priority: 'medium' },
  { id: 42, task: 'Helm Overhead Paint',                category: 'Paint/Finishes',      assigned: 'Charlie', priority: 'low' },
  { id: 43, task: 'Hairline Cracks Port Side Outdoors', category: 'Fiberglass/Hull',     assigned: 'Jack',    priority: 'high' },
  { id: 44, task: 'Rub Rail',                           category: 'Fiberglass/Hull',     assigned: 'Jack',    priority: 'high' },
  { id: 45, task: 'Starboard Helm Window Leak',         category: 'Fiberglass/Hull',     assigned: 'Jack',    priority: 'high' },
  { id: 46, task: 'EisenGlass',                         category: 'Canvas/Enclosure',    assigned: 'Jack',    priority: 'medium' },
  { id: 47, task: 'Canvas',                             category: 'Canvas/Enclosure',    assigned: 'Jack',    priority: 'medium' },
];

// Idempotent: only seed if tables are empty
const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
if (catCount === 0) {
  const insertCat = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  for (const c of categories) {
    insertCat.run(c.name, c.color);
  }
  console.log(`Seeded ${categories.length} categories`);
} else {
  console.log(`Categories table already has ${catCount} rows, skipping`);
}

const crewCount = db.prepare('SELECT COUNT(*) as count FROM crew').get().count;
if (crewCount === 0) {
  const insertCrew = db.prepare('INSERT INTO crew (name, role, phone, email) VALUES (?, ?, ?, ?)');
  for (const c of crew) {
    insertCrew.run(c.name, c.role, c.phone, c.email);
  }
  console.log(`Seeded ${crew.length} crew members`);
} else {
  console.log(`Crew table already has ${crewCount} rows, skipping`);
}

const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
if (taskCount === 0) {
  const insertTask = db.prepare(
    'INSERT INTO tasks (task, category, assigned, status, priority) VALUES (?, ?, ?, ?, ?)'
  );
  for (const t of tasks) {
    insertTask.run(t.task, t.category, t.assigned, 'todo', t.priority);
  }
  console.log(`Seeded ${tasks.length} tasks`);
} else {
  console.log(`Tasks table already has ${taskCount} rows, skipping`);
}

console.log('Seed complete.');
