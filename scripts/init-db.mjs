import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./prisma/dev.db");
db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  fullName TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'DEMO',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS Patient (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE,
  fullName TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  bloodGroup TEXT,
  allergiesNote TEXT,
  chronicNote TEXT,
  emergencyName TEXT,
  emergencyPhone TEXT,
  relationToPatient TEXT,
  city TEXT,
  preferredLanguage TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Doctor (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  specialty TEXT,
  hospitalName TEXT,
  phone TEXT,
  city TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS Visit (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  doctorId TEXT NOT NULL,
  visitDate DATETIME NOT NULL,
  complaint TEXT,
  diagnosis TEXT,
  visitType TEXT,
  clinicName TEXT,
  patientSummary TEXT,
  doctorSummary TEXT,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (patientId) REFERENCES Patient(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES Doctor(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS Visit_patientId_visitDate_idx ON Visit(patientId, visitDate);
CREATE TABLE IF NOT EXISTS Prescription (
  id TEXT PRIMARY KEY,
  visitId TEXT NOT NULL,
  sourceType TEXT NOT NULL DEFAULT 'uploaded',
  sourceLabel TEXT,
  extractedText TEXT,
  reviewStatus TEXT NOT NULL DEFAULT 'reviewed',
  patientSafeSummary TEXT,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (visitId) REFERENCES Visit(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Medication (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  patientExplanation TEXT,
  caution TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS PrescriptionMedication (
  id TEXT PRIMARY KEY,
  prescriptionId TEXT NOT NULL,
  medicationId TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  durationDays INTEGER,
  instructions TEXT,
  startDate DATETIME,
  endDate DATETIME,
  isCurrent BOOLEAN NOT NULL DEFAULT 0,
  reasonAsWritten TEXT,
  FOREIGN KEY (prescriptionId) REFERENCES Prescription(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (medicationId) REFERENCES Medication(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS PrescriptionMedication_prescriptionId_idx ON PrescriptionMedication(prescriptionId);
CREATE INDEX IF NOT EXISTS PrescriptionMedication_medicationId_idx ON PrescriptionMedication(medicationId);
CREATE TABLE IF NOT EXISTS TestRecommendation (
  id TEXT PRIMARY KEY,
  visitId TEXT NOT NULL,
  testName TEXT NOT NULL,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'advised',
  recommendedDate DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (visitId) REFERENCES Visit(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Allergy (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  name TEXT NOT NULL,
  severity TEXT,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (patientId) REFERENCES Patient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Condition (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT,
  diagnosedOn DATETIME,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (patientId) REFERENCES Patient(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

db.close();
console.log("SQLite schema initialized at prisma/dev.db");
