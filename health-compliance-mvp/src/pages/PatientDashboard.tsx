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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Activity,
  Droplet,
  Moon,
  LogOut,
  User,
  Trash2
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

interface Goal {
  _id: string;
  date: string;
  steps: number;
  sleep: number;
  water: number;
  notes?: string;
}

const PatientDashboard = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // GOALS STATE
  // -------------------------------------------------------------
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);

  const [newGoal, setNewGoal] = useState({
    steps: "",
    sleep: "",
    water: "",
    notes: ""
  });

  // -------------------------------------------------------------
  // PROFILE STATE
  // -------------------------------------------------------------
  const [profileExists, setProfileExists] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    medicalHistory: ""
  });

  // -------------------------------------------------------------
  // FETCH PROFILE (GET /api/patient/profile)
  // -------------------------------------------------------------
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/patient/profile`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (res.status === 404) {
        setProfileExists(false);
        setLoadingProfile(false);
        return;
      }

      if (!res.ok) throw new Error(result.message);

      setProfile(result.data.profile);
      setProfileExists(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  // -------------------------------------------------------------
  // FETCH GOALS (GET /api/goals)
  // -------------------------------------------------------------
  const fetchGoals = async () => {
    try {
      const res = await fetch(`${API_URL}/goals`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setGoals(result.data.goals || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchProfile();
  }, []);

  // -------------------------------------------------------------
  // ADD GOAL (POST /api/goals)
  // -------------------------------------------------------------
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      steps: Number(newGoal.steps),
      sleep: Number(newGoal.sleep),
      water: Number(newGoal.water),
      notes: newGoal.notes
    };

    try {
      const res = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Goal added!");

      setNewGoal({ steps: "", sleep: "", water: "", notes: "" });

      fetchGoals();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // DELETE GOAL (DELETE /api/goals/:id)
  // -------------------------------------------------------------
  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Goal deleted!");
      fetchGoals();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // SAVE PROFILE  (POST or PUT)
  // -------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = `${API_URL}/patient/profile`;
    const method = profileExists ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(profile)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(profileExists ? "Profile updated!" : "Profile created!");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      toast.success("Logged out!");
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="goals">My Goals</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* ------------------------------------------------------------- */}
          {/* GOALS TAB */}
          {/* ------------------------------------------------------------- */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Daily Goals</CardTitle>
                <CardDescription>Track your daily metrics</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Steps</Label>
                      <Input
                        type="number"
                        value={newGoal.steps}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, steps: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Sleep (hrs)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={newGoal.sleep}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, sleep: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Water (glasses)</Label>
                      <Input
                        type="number"
                        value={newGoal.water}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, water: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <Label>Notes</Label>
                  <Input
                    value={newGoal.notes}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, notes: e.target.value })
                    }
                    placeholder="Any extra notes..."
                  />

                  <Button type="submit" className="w-full">
                    Add Goal
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ------------------------------------------------------------- */}
            {/* GOAL HISTORY */}
            {/* ------------------------------------------------------------- */}
            <Card>
              <CardHeader>
                <CardTitle>Your Goal History</CardTitle>
              </CardHeader>

              <CardContent>
                {loadingGoals ? (
                  <p>Loading...</p>
                ) : goals.length === 0 ? (
                  <p>No goals yet</p>
                ) : (
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div
                        key={goal._id}
                        className="p-4 border rounded-md bg-muted/40 flex justify-between"
                      >
                        <div>
                          <p className="font-semibold">{goal.date}</p>
                          <p>
                            <Activity className="w-4 h-4 inline mr-1" />
                            {goal.steps} steps
                          </p>
                          <p>
                            <Moon className="w-4 h-4 inline mr-1" />
                            {goal.sleep} hours
                          </p>
                          <p>
                            <Droplet className="w-4 h-4 inline mr-1" />
                            {goal.water} glasses
                          </p>
                          {goal.notes && <p>📝 {goal.notes}</p>}
                        </div>

                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteGoal(goal._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------------------------------------- */}
          {/* PROFILE TAB */}
          {/* ------------------------------------------------------------- */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>
                  <User className="w-5 h-5 inline mr-2" />
                  {profileExists
                    ? `Hi, ${profile.firstName || "there"} 👋`
                    : "Profile Information"}
                </CardTitle>

                <CardDescription>
                  {profileExists
                    ? "View or update your personal details"
                    : "No profile found. Create your profile to continue."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {loadingProfile ? (
                  <p>Loading Profile...</p>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">

                    {/* FIRST + LAST NAME */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    {/* DOB */}
                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) =>
                          setProfile({ ...profile, dateOfBirth: e.target.value })
                        }
                      />
                    </div>

                    {/* PHONE */}
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="9876543210"
                      />
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={profile.address}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        placeholder="Your address"
                      />
                    </div>

                    {/* MEDICAL HISTORY */}
                    <div>
                      <Label>Medical History</Label>
                      <Input
                        value={profile.medicalHistory}
                        onChange={(e) =>
                          setProfile({ ...profile, medicalHistory: e.target.value })
                        }
                        placeholder="Any medical history..."
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {profileExists ? "Update Profile" : "Create Profile"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default PatientDashboard;
