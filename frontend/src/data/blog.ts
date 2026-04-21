export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "malaria-prevention",
    title: "Malaria Prevention: Protecting Your Family in Kenya",
    excerpt: "Learn practical tips to protect your family from malaria during the rainy season.",
    content: "Malaria remains one of the most common health threats in Kenya, particularly during the rainy seasons when mosquito breeding sites multiply. In 2023, Kenya reported over 6 million cases, with children under 5 and pregnant women most vulnerable.\n\nThe Anopheles mosquito, carrier of the Plasmodium parasite, is most active at dusk and dawn. Key prevention strategies include using insecticide-treated bed nets every night, even for short naps. The Kenyan Ministry of Health recommends long-lasting insecticidal nets (LLINs) that remain effective for 3 years. Free distribution campaigns happen regularly - check your county health office.\n\nEnvironmental management is crucial. Remove standing water from flower pots, old tyres, blocked drains, and buckets around your home. In rural areas, clear vegetation around your compound to reduce mosquito resting sites. Plant mosquito-repelling plants like lemongrass, lavender, and marigolds in your kitchen garden.\n\n**Personal Protection:** Apply repellents containing DEET (20-30%), picaridin, or oil of lemon eucalyptus to exposed skin and clothing. Reapply every 4-6 hours. Wear long sleeves and trousers during peak mosquito hours, especially light-colored clothing.\n\n**Indoor Protection:** Install and maintain window/door screens. Use coils or plug-in vaporizers containing pyrethroids. Ceiling fans create air currents mosquitoes dislike.\n\n**Chemoprophylaxis for Travelers:** If visiting high-risk areas like Lake Victoria basin or coastal regions, consult your doctor about antimalarials like doxycycline or atovaquone-proguanil.\n\n**When to Seek Treatment:** Fever, chills, headache, muscle pain, nausea within 7-30 days of exposure require immediate medical attention. Rapid diagnostic tests (RDTs) at most health facilities confirm diagnosis in 15 minutes. Artemisinin-based combination therapy (ACT) like AL (artemether-lumefantrine) is standard first-line treatment.\n\n**Special Groups:** Pregnant women get free IPTp (intermittent preventive treatment) with SP (sulfadoxine-pyrimethamine) at antenatal clinics starting second trimester. Children under 5 need immediate ACT dosing by weight.\n\n**Community Action:** Indoor residual spraying (IRS) programs by county health departments target high-risk villages. Participate and report any side effects. Vector surveillance helps predict outbreaks.\n\n**FAQs:** Q: Can I get malaria from jiggers? A: No, malaria is mosquito-borne only. Q: Is artemisia/annona tea effective? A: No proven evidence; stick to WHO-approved methods.\n\n**Local Resources:** NHIF covers malaria treatment. Dial 1195 for nearest health facility. Kenya Medical Supplies Authority (KEMSA) ensures medicine availability.\n\nPrevention saves lives and money. One LLIN costs KSh 250 but prevents hospitalization costing thousands.",
    author: "Dr. Amina Wanjiku",
    date: "2026-03-28",
    category: "Prevention",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop",
  },
  {
    id: "diabetes-management",
    title: "Living Well with Diabetes: A Kenyan Guide",
    excerpt: "Managing diabetes with local foods and lifestyle changes that work for you.",
    content: "Diabetes management doesn't have to mean giving up your favorite Kenyan dishes. With smart portion control and balanced plates, you can enjoy ugali, sukuma wiki, nyama choma, and chapati while maintaining healthy blood sugar.\n\n**The Plate Method:** Fill HALF your plate with non-starchy vegetables (sukuma wiki, spinach, cabbage, managu), ONE-QUARTER with whole grains or starchy foods (brown ugali, millet porridge, sweet potatoes, matoke), ONE-QUARTER with lean proteins (fish tilapia from Lake Victoria, beans/githeri, chicken breast without skin, eggs).\n\n**Kenyan Superfoods:** Avocados (from Kisii or your backyard) provide healthy fats and fiber. Moringa leaves (mruma tree) regulate blood sugar - add to sukuma. Chia seeds or flaxseeds in uji. Bitter melon (bitter apple) - consult doctor for safe use. Groundnuts (peanuts) as healthy snack.\n\n**Physical Activity:** 30 minutes brisk walking daily - perfect for market visits or church. Traditional dances (Ohangla, Benga) 3x/week. Farmers: Continue jua kali work! Aim 150 minutes moderate exercise weekly.\n\n**Monitoring:** Test fasting blood sugar weekly using NHIF glucometers (KSh 500-1000). Target 80-130 mg/dL fasting, <180 mg/dL after meals. Annual HbA1c <7% at county hospital labs.\n\n**Medications:** Metformin first-line, insulin for Type 1/your doctor advises. Never skip doses. NHIF covers most oral meds.\n\n**Foot Care:** Check feet daily for cuts/blisters. Diabetes affects nerves (neuropathy) and circulation. Use petroleum jelly, comfortable jootas. No barefoot walking.\n\n**Eye Care:** Annual retinopathy screening at eye clinics. Early laser treatment prevents blindness.\n\n**Hypertension Link:** 2/3 diabetics have high BP. Check regularly.\n\n**FAQs:** Q: Can I eat mangoes? A: Yes, in moderation with protein/fat. Q: Alcohol? A: No/low, avoid chang'aa.\n\n**Warning Signs:** Unhealing wounds, blurred vision, numbness, extreme thirst - seek emergency care.\n\n**Support:** Kenya Diabetes Management Association, church groups. NHIF diabetes clinics free.\n\nSmall changes = big results. Your health, your wealth.",
    author: "Dr. James Omondi",
    date: "2026-03-20",
    category: "Chronic Disease",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    id: "child-vaccinations",
    title: "KEPI Vaccination Schedule: What Every Parent Should Know",
    excerpt: "A complete guide to Kenya's childhood immunization program.",
    content: "The Kenya Expanded Programme on Immunization (KEPI) protects against 12 preventable diseases. Follow this schedule religiously for your child's healthy start.\n\n**At Birth (within 24hrs):** BCG (TB protection), Hepatitis B1, OPV0 (Polio). Given at maternity/postnatal clinic. Essential even for home births - visit clinic Day 1.\n\n**6 Weeks:** Pentavalent1 (Diphtheria, Pertussis/whooping cough, Tetanus, HepB2, Hib/meningitis), OPV1, Pneumococcal1 (pneumonia), Rotavirus1 (diarrhea).\n\n**10 Weeks:** Pentavalent2, OPV2, Pneumococcal2, Rotavirus2.\n\n**14 Weeks:** Pentavalent3, OPV3, Pneumococcal3, Rotavirus3.\n\n**6 Months:** Measles1, Yellow Fever (endemic areas like Western Kenya).\n\n**18 Months:** Measles2/DTP Booster.\n\n**5-6 Years (School entry):** Td Booster (Tetanus/Diphtheria).\n\n**Catch-up:** Missed doses? Clinics vaccinate anytime. No restart needed.\n\n**Side Effects:** Mild fever, redness/swelling at site (paracetamol OK). Severe reaction? Report to clinic.\n\n**Vaccination Card:** Your child's health passport. Keep safe! Shows school requirements.\n\n**Why Important:** Vaccines prevented 154M deaths globally 50yrs. Kenya: Measles cases down 98%.\n\n**Myths:** 'Vaccines cause autism' - FALSE (WHO proven). 'Natural immunity better' - vaccines SAFE.\n\n**Pregnancy:** Tetanus toxoid protects mother/newborn.\n\n**FAQs:** Q: Free? A: 100% free NHIF. Q: Painful? A: Quick pinch, lifelong protection.\n\n**Resources:** Mother-child booklet, 1195 health line, county clinics weekly.\n\nVaccinate on time, every time. #FullyVaccinated.",
    author: "Dr. Grace Njeri",
    date: "2026-03-15",
    category: "Children's Health",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1632053002928-1919605ee6f7?w=600&h=400&fit=crop",
  },
  {
    id: "mental-health-stigma",
    title: "Breaking the Mental Health Stigma in Kenya",
    excerpt: "It's okay not to be okay. Understanding mental health in our communities.",
    content: "Mental health = physical health. Kenya making progress: Mathari Hospital expansions, county units, NHIF coverage.\n\n**Prevalence:** Depression 4%, anxiety 5.8%, postpartum depression 44% new mothers. Suicide rates rising among youth.\n\n**Signs:** Persistent sadness >2wks, loss interest (even church/friends), sleep/appetite changes, irritability, concentration issues, suicidal thoughts.\n\n**Barriers:** 'Weakness', pastor/mganga first, family shame. Truth: Brain chemistry + life stress. Like malaria needs medicine.\n\n**Treatment:** Medication (SSRIs safe) + counseling/Talk Therapy. NHIF outpatient psychiatry covered. Talanta Heleni app free counseling.\n\n**Traditional vs Modern:** Herbs help stress but depression needs doctor. Integrate: church support + therapy.\n\n**Workplace:** EAP programs growing. Take leave - productivity returns.\n\n**Youth:** Exam pressure, social media. Schools adding counselors.\n\n**COVID Impact:** Isolation worsened anxiety. Masks hid smiles - connection key.\n\n**Self-Care:** Daily walk (even compound), Bible/journal, ugali friends time, sleep 7-8hrs, limit alcohol.\n\n**Hotlines:** Befrienders Kenya 0722 178 177, Samatanu 0800 221 221, 1195 Mental Health.\n\n**FAQs:** Q: Crazy people only? A: Everyone. Q: Medication addiction? A: No, monitored.\n\n**Community:** Chama groups, church testimonies. #ItsOkayNotToBeOkay.\n\nSeek help today. Strength in vulnerability.",
    author: "Dr. Daniel Kiprop",
    date: "2026-03-10",
    category: "Mental Health",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=400&fit=crop",
  },
];

