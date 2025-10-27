import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TANZANIA_CITIES = [
  {
    name: "Dar es Salaam",
    value: "dar_es_salaam",
    description: "Commercial capital - Finance, Tech, Logistics",
    icon: "🏙️",
  },
  {
    name: "Arusha",
    value: "arusha",
    description: "Tourism hub - Safari, Conservation, Hospitality",
    icon: "🦁",
  },
  {
    name: "Mwanza",
    value: "mwanza",
    description: "Lake Victoria - Fishing, Agriculture, Trade",
    icon: "🌊",
  },
  {
    name: "Dodoma",
    value: "dodoma",
    description: "Capital city - Government, Public Service",
    icon: "🏛️",
  },
  {
    name: "Mbeya",
    value: "mbeya",
    description: "Highland region - Agriculture, Mining",
    icon: "⛰️",
  },
];

interface LocationSelectorProps {
  onLocationSelected?: (location: string) => void;
}

export const LocationSelector = ({
  onLocationSelected,
}: LocationSelectorProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkUserLocation();
  }, [user]);

  const checkUserLocation = async () => {
    if (!user) return;

    try {
      // Check if user has location set
      const { data, error } = await supabase
        .from("profiles")
        .select("location")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found (expected for new users)
        console.error("Error checking location:", error);
        return;
      }

      // If no location or empty, show popup
      if (!data || !data.location) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSaveLocation = async () => {
    if (!selectedCity || !user) return;

    setSaving(true);
    try {
      // Upsert user profile with location
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          location: selectedCity,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) throw error;

      toast.success("Location saved successfully!");
      setOpen(false);

      // Callback to parent component
      if (onLocationSelected) {
        onLocationSelected(selectedCity);
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-2xl' hideClose>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl'>
            <MapPin className='h-6 w-6 text-primary' />
            Select Your Location
          </DialogTitle>
          <DialogDescription className='text-base'>
            Choose your city to get personalized career insights and
            opportunities relevant to your local job market.
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          {TANZANIA_CITIES.map((city) => (
            <button
              key={city.value}
              onClick={() => setSelectedCity(city.value)}
              className={`
                relative p-6 rounded-lg border-2 text-left transition-all
                hover:border-primary/50 hover:shadow-md
                ${
                  selectedCity === city.value
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200"
                }
              `}>
              {selectedCity === city.value && (
                <div className='absolute top-3 right-3'>
                  <div className='bg-primary text-white rounded-full p-1'>
                    <Check className='h-4 w-4' />
                  </div>
                </div>
              )}

              <div className='flex items-start gap-3'>
                <span className='text-3xl'>{city.icon}</span>
                <div className='flex-1'>
                  <h3 className='font-semibold text-lg mb-1'>{city.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {city.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className='flex justify-between items-center pt-4 border-t'>
          <p className='text-xs text-muted-foreground'>
            You can change this later in your profile settings
          </p>
          <Button
            onClick={handleSaveLocation}
            disabled={!selectedCity || saving}
            size='lg'>
            {saving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
