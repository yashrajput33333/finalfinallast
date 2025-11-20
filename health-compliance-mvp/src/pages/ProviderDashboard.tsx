import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Activity,
  Droplet,
  Moon,
  LogOut,
  Users
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api/provider";

interface Patient {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Goal {
  _id: string;
  date: string;
  steps: number;
  sleep: number;
  water: number;
  notes?: string;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // STATES
  // ------------------------------------------------------------
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [patientGoals, setPatientGoals] = useState<Goal[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingPatientGoals, setLoadingPatientGoals] = useState(false);

  // ------------------------------------------------------------
  // FETCH ALL PATIENTS (GET /provider/patients)
  // ------------------------------------------------------------
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setPatients(result.data.patients || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingPatients(false);
    }
  };

  // Load all patients when dashboard opens
  useEffect(() => {
    fetchPatients();
  }, []);

  // ------------------------------------------------------------
  // FETCH PATIENT GOALS (GET /provider/patients/:id/goals)
  // ------------------------------------------------------------
  const fetchPatientGoals = async (patientId: string) => {
    setLoadingPatientGoals(true);
    try {
      const res = await fetch(`${API_URL}/patients/${patientId}/goals`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setPatientGoals(result.data.goals || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingPatientGoals(false);
    }
  };

  // ------------------------------------------------------------
  // SELECT PATIENT
  // ------------------------------------------------------------
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    fetchPatientGoals(patient._id);
  };

  // ------------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      toast.success("Logged out!");
      navigate("/");
    } catch {
      toast.error("Unable to logout");
    }
  };

  // ------------------------------------------------------------
  // UI OUTPUT
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ------------------------------------------------------ */}
          {/* PATIENT LIST */}
          {/* ------------------------------------------------------ */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                <Users className="w-5 h-5 inline mr-2" />
                All Patients
              </CardTitle>
              <CardDescription>Select a patient to view their goals</CardDescription>
            </CardHeader>

            <CardContent>
              {loadingPatients ? (
                <p>Loading patients...</p>
              ) : patients.length === 0 ? (
                <p>No patients found</p>
              ) : (
                <div className="space-y-3">
                  {patients.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handleSelectPatient(p)}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${selectedPatient?._id === p._id
                          ? "bg-blue-50 border-blue-500"
                          : "bg-card hover:bg-muted/50"
                        }`}
                    >
                      <div className="font-semibold">
                        {p.firstName || p.lastName
                          ? `${p.firstName} ${p.lastName}`
                          : "Unnamed Patient"}
                      </div>
                      <div className="text-sm text-muted-foreground">{p.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ------------------------------------------------------ */}
          {/* PATIENT GOALS */}
          {/* ------------------------------------------------------ */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Patient Goals</CardTitle>
              <CardDescription>
                {selectedPatient
                  ? `Viewing health logs for ${selectedPatient.firstName || ""} ${selectedPatient.lastName || ""
                  }`
                  : "Select a patient from the list"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!selectedPatient ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a patient to view their goals</p>
                </div>
              ) : loadingPatientGoals ? (
                <p>Loading goals...</p>
              ) : patientGoals.length === 0 ? (
                <p>This patient has no goals logged</p>
              ) : (
                <div className="space-y-4">
                  {patientGoals.map((goal) => (
                    <div
                      key={goal._id}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="font-medium mb-3">{goal.date}</div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <Activity className="w-4 h-4 text-primary inline mr-1" />
                          <span className="font-semibold">{goal.steps}</span>
                          <div className="text-muted-foreground">steps</div>
                        </div>

                        <div>
                          <Moon className="w-4 h-4 text-secondary inline mr-1" />
                          <span className="font-semibold">{goal.sleep}</span>
                          <div className="text-muted-foreground">hours</div>
                        </div>

                        <div>
                          <Droplet className="w-4 h-4 text-primary inline mr-1" />
                          <span className="font-semibold">{goal.water}</span>
                          <div className="text-muted-foreground">glasses</div>
                        </div>
                      </div>

                      {goal.notes && <p className="mt-2 text-sm">📝 {goal.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
