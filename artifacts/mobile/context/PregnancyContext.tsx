import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type DietaryPreference = "veg" | "nonveg" | "vegan";

interface PregnancyContextType {
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  lmpDate: Date | null;
  setLmpDate: (date: Date | null) => void;
  dueDate: Date | null;
  momName: string;
  setMomName: (name: string) => void;
  dadName: string;
  setDadName: (name: string) => void;
  babyName: string;
  setBabyName: (name: string) => void;
  dietaryPreference: DietaryPreference;
  setDietaryPreference: (pref: DietaryPreference) => void;
  isSetup: boolean;
  completeSetup: () => void;
}

const PregnancyContext = createContext<PregnancyContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@pregnancy_data_v2";

function calcWeekFromLmp(lmp: Date): number {
  const diffMs = Date.now() - lmp.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(40, week));
}

function calcDueDateFromLmp(lmp: Date): Date {
  return new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
}

export function PregnancyProvider({ children }: { children: React.ReactNode }) {
  const [currentWeek, setCurrentWeekState] = useState<number>(8);
  const [lmpDate, setLmpDateState] = useState<Date | null>(null);
  const [momName, setMomNameState] = useState<string>("");
  const [dadName, setDadNameState] = useState<string>("");
  const [babyName, setBabyNameState] = useState<string>("Baby");
  const [dietaryPreference, setDietaryPreferenceState] = useState<DietaryPreference>("veg");
  const [isSetup, setIsSetup] = useState<boolean>(false);

  const dueDate = lmpDate ? calcDueDateFromLmp(lmpDate) : null;

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.lmpDate) {
            const lmp = new Date(data.lmpDate);
            setLmpDateState(lmp);
            setCurrentWeekState(calcWeekFromLmp(lmp));
          } else if (data.currentWeek) {
            setCurrentWeekState(data.currentWeek);
          }
          if (data.momName) setMomNameState(data.momName);
          if (data.dadName) setDadNameState(data.dadName);
          if (data.babyName) setBabyNameState(data.babyName);
          if (data.dietaryPreference) setDietaryPreferenceState(data.dietaryPreference);
          if (data.isSetup) setIsSetup(data.isSetup);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const save = useCallback(
    async (updates: Record<string, unknown>) => {
      try {
        const current: Record<string, unknown> = {
          currentWeek,
          lmpDate: lmpDate?.toISOString() ?? null,
          momName,
          dadName,
          babyName,
          dietaryPreference,
          isSetup,
        };
        const merged = { ...current, ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        // ignore
      }
    },
    [currentWeek, lmpDate, momName, dadName, babyName, dietaryPreference, isSetup]
  );

  const setCurrentWeek = useCallback(
    (week: number) => {
      setCurrentWeekState(week);
      save({ currentWeek: week });
    },
    [save]
  );

  const setLmpDate = useCallback(
    (date: Date | null) => {
      setLmpDateState(date);
      if (date) {
        const week = calcWeekFromLmp(date);
        setCurrentWeekState(week);
        save({ lmpDate: date.toISOString(), currentWeek: week });
      } else {
        save({ lmpDate: null });
      }
    },
    [save]
  );

  const setMomName = useCallback(
    (name: string) => {
      setMomNameState(name);
      save({ momName: name });
    },
    [save]
  );

  const setDadName = useCallback(
    (name: string) => {
      setDadNameState(name);
      save({ dadName: name });
    },
    [save]
  );

  const setBabyName = useCallback(
    (name: string) => {
      setBabyNameState(name);
      save({ babyName: name });
    },
    [save]
  );

  const setDietaryPreference = useCallback(
    (pref: DietaryPreference) => {
      setDietaryPreferenceState(pref);
      save({ dietaryPreference: pref });
    },
    [save]
  );

  const completeSetup = useCallback(() => {
    setIsSetup(true);
    save({ isSetup: true });
  }, [save]);

  return (
    <PregnancyContext.Provider
      value={{
        currentWeek,
        setCurrentWeek,
        lmpDate,
        setLmpDate,
        dueDate,
        momName,
        setMomName,
        dadName,
        setDadName,
        babyName,
        setBabyName,
        dietaryPreference,
        setDietaryPreference,
        isSetup,
        completeSetup,
      }}
    >
      {children}
    </PregnancyContext.Provider>
  );
}

export function usePregnancy() {
  const ctx = useContext(PregnancyContext);
  if (!ctx) throw new Error("usePregnancy must be used within PregnancyProvider");
  return ctx;
}
