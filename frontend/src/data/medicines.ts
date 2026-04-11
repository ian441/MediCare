export interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: string;
  price: number;
  description: string;
  requiresPrescription: boolean;
  inStock: boolean;
}

export const medicines: Medicine[] = [
  { id: "med-1", name: "Panadol Extra", generic: "Paracetamol 500mg + Caffeine 65mg", category: "Pain Relief", price: 250, description: "Effective relief for headaches, toothaches, and body pain.", requiresPrescription: false, inStock: true },
  { id: "med-2", name: "Amoxil 500mg", generic: "Amoxicillin 500mg", category: "Antibiotics", price: 450, description: "Broad-spectrum antibiotic for bacterial infections.", requiresPrescription: true, inStock: true },
  { id: "med-3", name: "Metformin 500mg", generic: "Metformin HCl", category: "Diabetes", price: 350, description: "First-line medication for type 2 diabetes management.", requiresPrescription: true, inStock: true },
  { id: "med-4", name: "Amlodipine 5mg", generic: "Amlodipine Besylate", category: "Blood Pressure", price: 300, description: "Calcium channel blocker for hypertension.", requiresPrescription: true, inStock: true },
  { id: "med-5", name: "Ventolin Inhaler", generic: "Salbutamol 100mcg", category: "Respiratory", price: 800, description: "Quick-relief inhaler for asthma and bronchospasm.", requiresPrescription: true, inStock: true },
  { id: "med-6", name: "ORS Sachets (10 pack)", generic: "Oral Rehydration Salts", category: "Hydration", price: 150, description: "Essential for rehydration during diarrhea and dehydration.", requiresPrescription: false, inStock: true },
  { id: "med-7", name: "Cetrizine 10mg", generic: "Cetirizine HCl", category: "Allergy", price: 200, description: "Non-drowsy antihistamine for allergies.", requiresPrescription: false, inStock: true },
  { id: "med-8", name: "Omeprazole 20mg", generic: "Omeprazole", category: "Gastric", price: 400, description: "Proton pump inhibitor for acid reflux and ulcers.", requiresPrescription: true, inStock: true },
  { id: "med-9", name: "Ibuprofen 400mg", generic: "Ibuprofen", category: "Pain Relief", price: 200, description: "Anti-inflammatory pain reliever.", requiresPrescription: false, inStock: true },
  { id: "med-10", name: "Multivitamin Complex", generic: "Vitamins A, B, C, D, E + Minerals", category: "Supplements", price: 600, description: "Daily multivitamin for overall health.", requiresPrescription: false, inStock: true },
  { id: "med-11", name: "Zinc Tablets 20mg", generic: "Zinc Sulphate", category: "Supplements", price: 250, description: "Supports immune function and wound healing.", requiresPrescription: false, inStock: true },
  { id: "med-12", name: "Artemether-Lumefantrine", generic: "AL Tablets", category: "Antimalarials", price: 500, description: "First-line treatment for uncomplicated malaria.", requiresPrescription: true, inStock: true },
];
