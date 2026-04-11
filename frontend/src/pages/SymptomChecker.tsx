import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "What is your main symptom?",
    options: ["Headache", "Fever", "Stomach pain", "Chest pain", "Cough", "Skin rash", "Joint pain", "Fatigue", "Difficulty breathing", "Other"],
  },
  {
    question: "How long have you had this symptom?",
    options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week", "More than a month"],
  },
  {
    question: "How severe is the symptom?",
    options: ["Mild - manageable", "Moderate - uncomfortable", "Severe - affecting daily activities", "Very severe - unbearable"],
  },
  {
    question: "Do you have any of these additional symptoms?",
    options: ["Nausea/Vomiting", "Dizziness", "Body aches", "Loss of appetite", "Night sweats", "None of the above"],
  },
  {
    question: "Do you have any pre-existing conditions?",
    options: ["Diabetes", "Hypertension", "Asthma", "Heart disease", "None", "Other"],
  },
];

interface Result {
  condition: string;
  severity: string;
  recommendation: string;
  service: string;
  doctor: string;
  urgent: boolean;
}

function getResult(answers: string[]): Result {
  const mainSymptom = answers[0];
  const severity = answers[2];

  if (mainSymptom === "Chest pain" || mainSymptom === "Difficulty breathing") {
    return { condition: "Possible cardiac or respiratory issue", severity: "High", recommendation: "Seek immediate medical attention. Visit our Emergency unit or call 0700 000 000.", service: "Emergency & Urgent Care", doctor: "Dr. James Omondi", urgent: true };
  }
  if (mainSymptom === "Fever" && answers[3]?.includes("Night sweats")) {
    return { condition: "Possible malaria or infection", severity: "Moderate-High", recommendation: "Get a blood test (malaria screening) and consult a doctor within 24 hours.", service: "General & Family Medicine", doctor: "Dr. Amina Wanjiku", urgent: false };
  }
  if (mainSymptom === "Headache") {
    return { condition: "Tension headache or migraine", severity: severity.includes("Severe") ? "Moderate" : "Low", recommendation: "Rest, hydrate, and take OTC pain relief. If persistent, book a consultation.", service: "General & Family Medicine", doctor: "Dr. Amina Wanjiku", urgent: false };
  }
  if (mainSymptom === "Skin rash") {
    return { condition: "Possible dermatological condition", severity: "Low-Moderate", recommendation: "Book a dermatology appointment for proper diagnosis.", service: "Dermatology", doctor: "Dr. Faith Mwangi", urgent: false };
  }
  if (mainSymptom === "Joint pain") {
    return { condition: "Possible musculoskeletal issue", severity: "Moderate", recommendation: "Book an orthopedic consultation for assessment.", service: "Orthopedics", doctor: "Dr. Peter Kamau", urgent: false };
  }
  return { condition: "General health concern", severity: "Low-Moderate", recommendation: "Book a general consultation for proper evaluation.", service: "General & Family Medicine", doctor: "Dr. Amina Wanjiku", urgent: false };
}

export default function SymptomChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const result = done ? getResult(answers) : null;

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Symptom Checker
          </motion.h1>
          <p className="text-lg opacity-80">Answer a few questions and we'll recommend the right care for you</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-2xl">
          {!done ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-muted-foreground">Question {step + 1} of {questions.length}</p>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div key={i} className={`w-8 h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
                    ))}
                  </div>
                </div>
                <h2 className="font-heading font-bold text-xl mb-6">{questions[step].question}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(opt)}
                      className={`p-4 rounded-lg border-2 text-left text-sm transition-all ${
                        answers[step] === opt ? "border-primary bg-accent font-semibold" : "border-border hover:border-primary/30"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button onClick={next} disabled={!answers[step]} className="gradient-medical border-0 text-primary-foreground">
                    {step < questions.length - 1 ? "Next" : "Get Results"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={result.urgent ? "border-destructive" : "border-secondary"}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    {result.urgent ? <AlertTriangle className="w-8 h-8 text-destructive" /> : <CheckCircle className="w-8 h-8 text-secondary" />}
                    <h2 className="font-heading font-bold text-xl">Assessment Results</h2>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between"><span className="text-muted-foreground">Possible Condition</span><span className="font-semibold">{result.condition}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Severity</span><span className={`font-semibold ${result.urgent ? "text-destructive" : "text-secondary"}`}>{result.severity}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Recommended Service</span><span className="font-semibold text-primary">{result.service}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Suggested Doctor</span><span className="font-semibold">{result.doctor}</span></div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm"><strong>Recommendation:</strong> {result.recommendation}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-6">⚠️ This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.</p>
                  <div className="flex gap-3 flex-wrap">
                    <Link to="/appointments"><Button className="gradient-medical border-0 text-primary-foreground">Book Appointment</Button></Link>
                    <Button variant="outline" onClick={() => { setStep(0); setAnswers([]); setDone(false); }}>Start Over</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
