import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchNectaResult } from "@/server-functions/necta";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

interface NectaResultFetcherProps {
  onResultsFetched: (results: { points: string; division: string; subjects: string }) => void;
}

export function NectaResultFetcher({ onResultsFetched }: NectaResultFetcherProps) {
  const [indexNumber, setIndexNumber] = useState("");
  const [examType, setExamType] = useState<"CSEE" | "ACSEE">("CSEE");
  const [year, setYear] = useState("2023");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!indexNumber || !indexNumber.includes("/")) {
      setError("Please enter a valid Index Number (e.g., S0101/0001)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchNectaResult({ data: { indexNumber, examType, year } });

      if (!response.success) {
        setError(response.error || "Could not fetch results");
        toast.error("Failed to fetch NECTA results");
      } else if (response.result) {
        toast.success("Results fetched successfully!");
        onResultsFetched(response.result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 p-6 rounded-lg border border-border/50 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Auto-Fetch NECTA Results
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your examination details to automatically fetch your grades and division from NECTA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="indexNumber">Index Number</Label>
          <Input
            id="indexNumber"
            placeholder="e.g. S0101/0001"
            value={indexNumber}
            onChange={(e) => setIndexNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examType">Exam Type</Label>
          <Select value={examType} onValueChange={(v: "CSEE" | "ACSEE") => setExamType(v)}>
            <SelectTrigger id="examType">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSEE">CSEE (Form 4)</SelectItem>
              <SelectItem value="ACSEE">ACSEE (Form 6)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 6 }).map((_, i) => {
                const y = (new Date().getFullYear() - 1 - i).toString();
                return (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={handleFetch} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching...
            </>
          ) : (
            "Fetch Results"
          )}
        </Button>
      </div>
    </div>
  );
}
