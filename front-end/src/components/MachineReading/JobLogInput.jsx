import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logMachineReading,
  fetchMachines,
  selectAllMachines, 
  selectMachinesLoadingState,
  selectMachineErrors
} from "../../store/slices/machineSlice";
import { fetchJobs } from "../../store/slices/jobSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const initialFormState = {
  job_id: "",
  machine_id: "",
  start_meter: "",
  end_meter: "",
};

const JobLogInput = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  // Redux selectors
  const jobs = useSelector((state) => state.jobs.jobs);
  const machines = useSelector(selectAllMachines);
  const loading = useSelector(selectMachinesLoadingState) === "loading";
  const error = useSelector(selectMachineErrors);

  useEffect(() => {
    dispatch(fetchJobs({ progressStatus: "in_progress" }));
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.job_id) {
      newErrors.job_id = "Job selection is required";
    }
    if (!formData.machine_id) {
      newErrors.machine_id = "Machine selection is required";
    }
    if (!formData.start_meter) {
      newErrors.start_meter = "Start meter reading is required";
    }
    if (!formData.end_meter) {
      newErrors.end_meter = "End meter reading is required";
    }
    if (
      formData.start_meter &&
      formData.end_meter &&
      parseFloat(formData.end_meter) <= parseFloat(formData.start_meter)
    ) {
      newErrors.end_meter = "End meter must be greater than start meter";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(logMachineReading(formData)).unwrap();
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      console.error("Error logging machine reading:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Log Machine Usage</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Job Selection */}
          <div>
            <Label htmlFor="job_id">Job</Label>
            <Select
              value={formData.job_id}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "job_id", value } })
              }
            >
              <SelectTrigger
                className={errors.job_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    #{job.id} - {job.client_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.job_id && (
              <p className="text-sm text-red-500">{errors.job_id}</p>
            )}
          </div>

          {/* Machine Selection */}
          <div>
            <Label htmlFor="machine_id">Machine</Label>
            <Select
              value={formData.machine_id}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "machine_id", value } })
              }
              disabled={machines.length === 0}
            >
              <SelectTrigger
                className={errors.machine_id ? "border-red-500" : ""}
              >
                <SelectValue 
                  placeholder={
                    machines.length === 0 ? "Loading machines..." : "Select a machine"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id.toString()}>
                    {machine.name} - {machine.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machine_id && (
              <p className="text-sm text-red-500">{errors.machine_id}</p>
            )}
          </div>

          {/* Meter Readings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_meter">Start Meter Reading</Label>
              <Input
                type="number"
                id="start_meter"
                name="start_meter"
                value={formData.start_meter}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={errors.start_meter ? "border-red-500" : ""}
              />
              {errors.start_meter && (
                <p className="text-sm text-red-500">{errors.start_meter}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_meter">End Meter Reading</Label>
              <Input
                type="number"
                id="end_meter"
                name="end_meter"
                value={formData.end_meter}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={errors.end_meter ? "border-red-500" : ""}
              />
              {errors.end_meter && (
                <p className="text-sm text-red-500">{errors.end_meter}</p>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging...
              </>
            ) : (
              'Log Usage'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobLogInput;
