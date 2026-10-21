import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// SVG assets downloaded from Figma node 70:153 (file q4OVzpZDgUgZoTikqnYWoh)
const BACK_SVG = `<svg overflow="visible" viewBox="0 0 27.7371 18.3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Back" d="M26.5871 9.15H1.58707M9.19576 17.15L1.58707 9.15L9.19576 1.15" stroke="#6B52AE" stroke-width="2.3" stroke-linecap="round"/>
</svg>`;

const PIN_SVG = `<svg overflow="visible" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Location pin" d="M5.5 0.549805C6.81088 0.549805 8.06934 1.07575 8.99805 2.01367C9.92697 2.95198 10.4502 4.22633 10.4502 5.55566C10.4502 6.34919 10.148 7.30859 9.64648 8.33691C9.14967 9.35563 8.48184 10.394 7.80469 11.3311C7.12889 12.2662 6.45104 13.0898 5.94238 13.6807C5.77516 13.8749 5.62417 14.0419 5.5 14.1807C5.37583 14.0419 5.22484 13.8749 5.05762 13.6807C4.54896 13.0898 3.87111 12.2662 3.19531 11.3311C2.51816 10.394 1.85033 9.35563 1.35352 8.33691C0.852039 7.30859 0.549832 6.34919 0.549805 5.55566C0.549805 4.22633 1.07303 2.95198 2.00195 2.01367C2.93066 1.07575 4.18912 0.549805 5.5 0.549805ZM7.15039 5.44434C7.15039 5.88956 6.97503 6.31573 6.66504 6.62891C6.35517 6.94191 5.93581 7.11621 5.5 7.11621C5.06419 7.11621 4.64483 6.94191 4.33496 6.62891C4.02497 6.31573 3.84961 5.88956 3.84961 5.44434C3.84964 4.9991 4.02493 4.57293 4.33496 4.25977C4.64483 3.94677 5.06419 3.77246 5.5 3.77246C5.93581 3.77246 6.35517 3.94677 6.66504 4.25977C6.97507 4.57293 7.15036 4.9991 7.15039 5.44434ZM8.25 5.44434C8.24997 4.71091 7.96137 4.00661 7.44629 3.48633C6.931 2.96584 6.23113 2.67188 5.5 2.67188C4.76887 2.67188 4.069 2.96584 3.55371 3.48633C3.03863 4.00661 2.75003 4.71091 2.75 5.44434C2.75 6.17775 3.03867 6.88205 3.55371 7.40234C4.069 7.92284 4.76886 8.2168 5.5 8.2168C6.23114 8.2168 6.931 7.92284 7.44629 7.40234C7.96133 6.88205 8.25 6.17775 8.25 5.44434Z" stroke="#6B52AE" stroke-width="1.1"/>
</svg>`;

const CHEVRON_DOWN_SVG = `<svg overflow="visible" viewBox="0 0 11.8001 9.44849" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Change location" d="M0.90007 0.90007L5.90007 7.90007L10.9001 0.90007" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const SEARCH_SVG = `<svg overflow="visible" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="search">
<path id="Vector" d="M19.2501 19.2501L15.2718 15.2718M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03324 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03324 6.03324 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03324 17.4167 10.0833Z" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</g>
</svg>`;

const CLEAR_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4L4 12M4 4L12 12" stroke="#7e8184" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const KIT_SVG = `<svg overflow="visible" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Home collection kit">
<rect id="House" x="9" y="24" width="42" height="30" rx="3" fill="#FCFAFF"/>
<rect id="Window" x="13" y="31" width="8" height="9" rx="2" fill="#9DCBCB"/>
<rect id="Door" x="23" y="34" width="12" height="20" rx="2" fill="#D7CAEE"/>
<path id="Roof" d="M3 28L27 9C29 7.66667 31 7.66667 33 9L57 28L53 34L30 16L7 34L3 28Z" fill="#9B7BCA"/>
<rect id="Collection kit" x="34" y="36" width="25" height="23" rx="4" fill="#F4B267"/>
<rect id="Medical cross" x="40" y="45" width="13" height="5" rx="1" fill="white"/>
<rect id="Medical cross_2" x="44" y="41" width="5" height="13" rx="1" fill="white"/>
</g>
</svg>`;

const CHEVRON_RIGHT_SVG = `<svg overflow="visible" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="chevron-right">
<path id="Vector" d="M6 12L10 8L6 4" stroke="#6B52AE" stroke-width="2" stroke-linecap="round"/>
</g>
</svg>`;

const TEST_TUBES_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="test-tubes">
<path id="Vector" d="M8.625 1.9159V18.6881C8.625 19.3235 8.37258 19.933 7.92328 20.3823C7.47397 20.8317 6.86458 21.0841 6.22917 21.0841C5.59375 21.0841 4.98436 20.8317 4.53506 20.3823C4.08575 19.933 3.83333 19.3235 3.83333 18.6881V1.9159M19.1667 1.9159V18.6881C19.1667 19.3235 18.9142 19.933 18.4649 20.3823C18.0156 20.8317 17.4062 21.0841 16.7708 21.0841C16.1354 21.0841 15.526 20.8317 15.0767 20.3823C14.6274 19.933 14.375 19.3235 14.375 18.6881V1.9159M2.875 1.9159H9.58333M13.4167 1.9159H20.125M8.625 15.3336H3.83333M19.1667 15.3336H14.375" stroke="#CF7374" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const FLASK_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="flask-conical">
<path id="Vector" d="M13.4178 1.9159V7.66636C13.4177 7.98789 13.4984 8.30429 13.6526 8.58643L18.933 18.2472C19.0927 18.5391 19.1737 18.8676 19.1679 19.2004C19.1622 19.5331 19.0699 19.8586 18.9002 20.1449C18.7305 20.4311 18.4892 20.6682 18.2 20.8329C17.9109 20.9976 17.5839 21.0842 17.2511 21.0841H5.7512C5.41844 21.0842 5.0914 20.9976 4.80225 20.8329C4.5131 20.6682 4.2718 20.4311 4.1021 20.1449C3.93239 19.8586 3.84013 19.5331 3.83439 19.2004C3.82864 18.8676 3.90961 18.5391 4.06933 18.2472L9.34971 8.58643C9.50389 8.30429 9.58463 7.98789 9.5845 7.66636V1.9159M6.18499 14.3752H16.8167M8.14657 1.9159H14.8548" stroke="#6B52AE" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const DROPLET_SVG = `<svg overflow="visible" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="droplet">
<path id="Vector" d="M16.244 19.1192C14.9858 20.3773 13.2794 21.0841 11.5 21.0841C9.72064 21.0841 8.01415 20.3773 6.75595 19.1192C5.49775 17.8611 4.7909 16.1547 4.7909 14.3755C4.7909 12.4587 5.74934 10.6378 7.66623 9.10443C9.58311 7.57103 11.0208 5.27093 11.5 2.875C11.9792 5.27093 13.4169 7.57103 15.3338 9.10443C17.2507 10.6378 18.2091 12.4587 18.2091 14.3755C18.2091 16.1547 17.5023 17.8611 16.244 19.1192Z" stroke="#42998D" stroke-width="1.7" stroke-linecap="round"/>
</g>
</svg>`;

const PLUS_SVG = `<svg overflow="visible" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="plus">
<path id="Vector" d="M2.083 5H7.917M5 2.083V7.917" stroke="#6B52AE" stroke-width="1.8" stroke-linecap="round"/>
</g>
</svg>`;

const CHECK_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const CLOCK_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="#7e8184" stroke-width="2"/>
<path d="M12 6V12L16 14" stroke="#7e8184" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const CLOSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18M6 6L18 18" stroke="#1d1b26" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Category Definitions with 4 in a row layout
type CategoryId =
  | 'blood'
  | 'thyroid'
  | 'diabetes'
  | 'vitamins'
  | 'liver'
  | 'kidney'
  | 'heart'
  | 'fullbody';

type Category = {
  id: CategoryId;
  label: string;
  name: string;
  subtitle: string;
  image: number;
};

const CATEGORIES: Category[] = [
  {
    id: 'blood',
    label: 'Blood tests',
    name: 'Blood Tests',
    subtitle: 'CBC, Hemoglobin, ESR, Iron profiles',
    image: require('./assets/images/lab/art-blood.png'),
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    name: 'Thyroid Care',
    subtitle: 'T3, T4, TSH, Free hormones & Antibodies',
    image: require('./assets/images/lab/cat-thyroid.png'),
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    name: 'Diabetes Care',
    subtitle: 'Fasting, Random, PPBS & HbA1c testing',
    image: require('./assets/images/lab/cat-diabetes.png'),
  },
  {
    id: 'vitamins',
    label: 'Vitamins',
    name: 'Vitamins & Minerals',
    subtitle: 'Vitamin D, B12, Calcium & micronutrients',
    image: require('./assets/images/lab/art-vitamins.png'),
  },
  {
    id: 'liver',
    label: 'Liver function',
    name: 'Liver Function',
    subtitle: 'LFT complete, SGOT, SGPT, Bilirubin',
    image: require('./assets/images/lab/art-liver.png'),
  },
  {
    id: 'kidney',
    label: 'Kidney function',
    name: 'Kidney Function',
    subtitle: 'KFT, Creatinine, BUN, Uric Acid, Urine',
    image: require('./assets/images/lab/cat-kidney.png'),
  },
  {
    id: 'heart',
    label: 'Heart health',
    name: 'Heart & Lipid Care',
    subtitle: 'Lipid profile, Cholesterol, Triglycerides',
    image: require('./assets/images/consult/cardiology.png'),
  },
  {
    id: 'fullbody',
    label: 'Full body\ncheckup',
    name: 'Full Body Checkups',
    subtitle: 'Comprehensive wellness packages at home',
    image: require('./assets/images/home/full-body-checkups.png'),
  },
];

export type LabTest = {
  id: string;
  name: string;
  category: CategoryId;
  categoryName: string;
  shortDesc: string;
  price: number;
  originalPrice: number;
  discount: string;
  parametersCount: number;
  parameters: string[];
  fastingRequired: boolean;
  fastingInfo: string;
  sampleType: string;
  reportTime: string;
  description: string;
  popular?: boolean;
  iconType: 'tubes' | 'flask' | 'droplet';
};

const ALL_TESTS: LabTest[] = [
  // --- Blood Tests ---
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    category: 'blood',
    categoryName: 'Blood Tests',
    shortDesc: 'CBC \u2022 24 parameters \u2022 Blood sample',
    price: 299,
    originalPrice: 500,
    discount: '40% OFF',
    parametersCount: 24,
    parameters: [
      'Hemoglobin (Hb)',
      'Total Leucocyte Count (TLC)',
      'Platelet Count',
      'RBC Count',
      'Packed Cell Volume (PCV / Hematocrit)',
      'Mean Corpuscular Volume (MCV)',
      'Mean Corpuscular Hemoglobin (MCH)',
      'MCHC & RDW',
      'Differential Leucocyte Count (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils)',
    ],
    fastingRequired: false,
    fastingInfo: 'No fasting required. Any time of day.',
    sampleType: 'Whole Blood (EDTA)',
    reportTime: '6 hours',
    description:
      'Evaluates overall health and detects a wide range of disorders, including anemia, infections, leukemia, and platelet abnormalities.',
    popular: true,
    iconType: 'tubes',
  },
  {
    id: 'hb',
    name: 'Hemoglobin (Hb) Test',
    category: 'blood',
    categoryName: 'Blood Tests',
    shortDesc: 'Single parameter \u2022 Anemia screen',
    price: 120,
    originalPrice: 200,
    discount: '40% OFF',
    parametersCount: 1,
    parameters: ['Hemoglobin Concentration'],
    fastingRequired: false,
    fastingInfo: 'No fasting required.',
    sampleType: 'Whole Blood (EDTA)',
    reportTime: '3 hours',
    description:
      'Measures the amount of oxygen-carrying hemoglobin protein in your red blood cells to quickly screen for anemia.',
    iconType: 'tubes',
  },
  {
    id: 'esr',
    name: 'Erythrocyte Sedimentation Rate (ESR)',
    category: 'blood',
    categoryName: 'Blood Tests',
    shortDesc: 'Inflammation & infection marker',
    price: 150,
    originalPrice: 250,
    discount: '40% OFF',
    parametersCount: 1,
    parameters: ['ESR Westergren Method (1st Hour)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required.',
    sampleType: 'Whole Blood (Citrate/EDTA)',
    reportTime: '4 hours',
    description:
      'A blood test that indicates the presence of inflammation in the body caused by infections, autoimmune conditions, or chronic diseases.',
    iconType: 'tubes',
  },
  {
    id: 'iron_profile',
    name: 'Iron Deficiency Profile',
    category: 'blood',
    categoryName: 'Blood Tests',
    shortDesc: 'Serum Iron, TIBC, Ferritin & UIBC',
    price: 599,
    originalPrice: 1100,
    discount: '45% OFF',
    parametersCount: 4,
    parameters: [
      'Serum Iron',
      'Total Iron Binding Capacity (TIBC)',
      'Unsaturated Iron Binding Capacity (UIBC)',
      'Transferrin Saturation %',
    ],
    fastingRequired: true,
    fastingInfo: '10-12 hours overnight fasting recommended.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Comprehensive profile assessing the body’s iron storage and transport capacity, identifying early iron deficiency or overload.',
    iconType: 'flask',
  },

  // --- Diabetes Tests ---
  {
    id: 'fbs',
    name: 'Fasting Blood Sugar (FBS)',
    category: 'diabetes',
    categoryName: 'Diabetes Care',
    shortDesc: 'Glucose Fasting \u2022 8-10 hrs fasting required',
    price: 149,
    originalPrice: 250,
    discount: '40% OFF',
    parametersCount: 1,
    parameters: ['Fasting Plasma Glucose (FBS)'],
    fastingRequired: true,
    fastingInfo: 'Strict 8-10 hours overnight fasting required. Water is permitted.',
    sampleType: 'Fluoride Plasma / Blood',
    reportTime: '4 hours',
    description:
      'Measures blood glucose levels after an overnight fast. Standard primary diagnostic test for diabetes, prediabetes, and insulin resistance.',
    popular: true,
    iconType: 'droplet',
  },
  {
    id: 'rbs',
    name: 'Random Blood Sugar (RBS)',
    category: 'diabetes',
    categoryName: 'Diabetes Care',
    shortDesc: 'Glucose Random \u2022 No fasting required',
    price: 149,
    originalPrice: 250,
    discount: '40% OFF',
    parametersCount: 1,
    parameters: ['Random Plasma Glucose (RBS)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required. Can be collected anytime.',
    sampleType: 'Fluoride Plasma / Blood',
    reportTime: '4 hours',
    description:
      'Measures glucose level in blood regardless of meal times. Essential for quick screening, emergency checks, and detecting hyperglycemia or hypoglycemia.',
    popular: true,
    iconType: 'droplet',
  },
  {
    id: 'ppbs',
    name: 'Post Prandial Blood Sugar (PPBS)',
    category: 'diabetes',
    categoryName: 'Diabetes Care',
    shortDesc: '2 hours after meal \u2022 Glucose test',
    price: 149,
    originalPrice: 250,
    discount: '40% OFF',
    parametersCount: 1,
    parameters: ['Post Prandial Plasma Glucose (PPBS)'],
    fastingRequired: false,
    fastingInfo: 'Sample must be collected exactly 2 hours after beginning your meal.',
    sampleType: 'Fluoride Plasma / Blood',
    reportTime: '4 hours',
    description:
      'Tests how efficiently the body clears glucose after eating. High post-meal spikes indicate diabetic vulnerability.',
    iconType: 'droplet',
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'diabetes',
    categoryName: 'Diabetes Care',
    shortDesc: '3-month average glucose \u2022 Blood sample',
    price: 449,
    originalPrice: 750,
    discount: '40% OFF',
    parametersCount: 2,
    parameters: ['HbA1c (Glycated Hemoglobin %)', 'Estimated Average Glucose (eAG)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required. Highly accurate 90-day glycemic indicator.',
    sampleType: 'Whole Blood (EDTA)',
    reportTime: '6 hours',
    description:
      'The gold standard test for measuring average blood sugar control over the previous 2 to 3 months.',
    popular: true,
    iconType: 'droplet',
  },
  {
    id: 'diabetes_care_package',
    name: 'Comprehensive Diabetic Health Package',
    category: 'diabetes',
    categoryName: 'Diabetes Care',
    shortDesc: 'FBS + PPBS + HbA1c + Lipid + Microalbumin',
    price: 1099,
    originalPrice: 2100,
    discount: '48% OFF',
    parametersCount: 14,
    parameters: [
      'Fasting Blood Sugar (FBS)',
      'Post Prandial Blood Sugar (PPBS)',
      'HbA1c & eAG',
      'Lipid Profile (Cholesterol, Triglycerides, HDL, LDL)',
      'Serum Creatinine',
      'Urine Microalbumin / Creatinine Ratio',
    ],
    fastingRequired: true,
    fastingInfo: '10-12 hours overnight fasting required.',
    sampleType: 'Blood & Urine samples',
    reportTime: '10 hours',
    description:
      'Complete monitoring package covering glycemic control, renal filtration, and cardiovascular lipid markers for diabetics.',
    iconType: 'flask',
  },

  // --- Thyroid Tests ---
  {
    id: 'thyroid_profile',
    name: 'Thyroid Profile (Total T3, Total T4, TSH)',
    category: 'thyroid',
    categoryName: 'Thyroid Care',
    shortDesc: 'T3, T4, TSH \u2022 3 parameters \u2022 Blood sample',
    price: 499,
    originalPrice: 900,
    discount: '45% OFF',
    parametersCount: 3,
    parameters: [
      'Total Triiodothyronine (T3)',
      'Total Thyroxine (T4)',
      'Thyroid Stimulating Hormone (TSH Ultrasensitive)',
    ],
    fastingRequired: true,
    fastingInfo: 'Overnight fasting (8-10 hrs) preferred. Morning sample.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Evaluates thyroid gland function, helping diagnose hypothyroidism (underactive thyroid) or hyperthyroidism (overactive thyroid).',
    popular: true,
    iconType: 'flask',
  },
  {
    id: 'tsh_ultra',
    name: 'TSH (Thyroid Stimulating Hormone)',
    category: 'thyroid',
    categoryName: 'Thyroid Care',
    shortDesc: 'Ultrasensitive 3rd generation TSH',
    price: 249,
    originalPrice: 450,
    discount: '45% OFF',
    parametersCount: 1,
    parameters: ['Thyroid Stimulating Hormone (TSH)'],
    fastingRequired: false,
    fastingInfo: 'Morning sample recommended for circadian peak accuracy.',
    sampleType: 'Blood Serum',
    reportTime: '6 hours',
    description:
      'First-line screening test for thyroid disorders and for monitoring thyroid hormone replacement medication.',
    iconType: 'flask',
  },
  {
    id: 'free_thyroid',
    name: 'Free Thyroid Profile (FT3, FT4, TSH)',
    category: 'thyroid',
    categoryName: 'Thyroid Care',
    shortDesc: 'Unbound active hormones & TSH',
    price: 799,
    originalPrice: 1400,
    discount: '43% OFF',
    parametersCount: 3,
    parameters: ['Free T3 (FT3)', 'Free T4 (FT4)', 'TSH Ultrasensitive'],
    fastingRequired: true,
    fastingInfo: 'Overnight fasting preferred.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Measures active, unbound thyroid hormones unaffected by protein changes in the bloodstream, ideal during pregnancy or HRT.',
    iconType: 'flask',
  },
  {
    id: 'anti_tpo',
    name: 'Anti-TPO Antibody (Thyroid Peroxidase)',
    category: 'thyroid',
    categoryName: 'Thyroid Care',
    shortDesc: 'Autoimmune thyroiditis & Hashimoto check',
    price: 1199,
    originalPrice: 1800,
    discount: '33% OFF',
    parametersCount: 1,
    parameters: ['Anti-Thyroid Peroxidase Antibodies (Anti-TPO)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required.',
    sampleType: 'Blood Serum',
    reportTime: '12 hours',
    description:
      'Detects autoimmune thyroid disease such as Hashimoto thyroiditis or Graves disease causing unexplained fatigue and weight changes.',
    iconType: 'flask',
  },

  // --- Vitamins & Minerals ---
  {
    id: 'vit_d',
    name: 'Vitamin D (25-OH Cholecalciferol)',
    category: 'vitamins',
    categoryName: 'Vitamins & Minerals',
    shortDesc: 'Bone health & immunity \u2022 Blood sample',
    price: 799,
    originalPrice: 1400,
    discount: '43% OFF',
    parametersCount: 1,
    parameters: ['25-Hydroxy Vitamin D (Total D2 + D3)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Assesses vitamin D status essential for bone density, calcium absorption, mood, and immune system resilience.',
    popular: true,
    iconType: 'flask',
  },
  {
    id: 'vit_b12',
    name: 'Vitamin B12 (Cyanocobalamin)',
    category: 'vitamins',
    categoryName: 'Vitamins & Minerals',
    shortDesc: 'Nerve health & energy \u2022 Blood sample',
    price: 699,
    originalPrice: 1200,
    discount: '42% OFF',
    parametersCount: 1,
    parameters: ['Vitamin B12 Concentration'],
    fastingRequired: true,
    fastingInfo: 'Overnight fasting (8-10 hrs) recommended.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Checks levels of Vitamin B12, crucial for brain health, nerve functioning, and healthy red blood cell production.',
    popular: true,
    iconType: 'flask',
  },
  {
    id: 'vit_duo',
    name: 'Vitamin D & B12 Combo Pack',
    category: 'vitamins',
    categoryName: 'Vitamins & Minerals',
    shortDesc: 'Complete vitality duo \u2022 2 key vitamins',
    price: 1299,
    originalPrice: 2200,
    discount: '41% OFF',
    parametersCount: 2,
    parameters: ['Vitamin D 25-OH', 'Vitamin B12'],
    fastingRequired: true,
    fastingInfo: 'Overnight fasting recommended.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'High-value combo testing the two most common vitamin deficiencies in India responsible for chronic fatigue, body ache, and brain fog.',
    iconType: 'flask',
  },
  {
    id: 'calcium_phosphorus',
    name: 'Serum Calcium & Phosphorus',
    category: 'vitamins',
    categoryName: 'Vitamins & Minerals',
    shortDesc: 'Bone mineral markers \u2022 Blood sample',
    price: 320,
    originalPrice: 550,
    discount: '42% OFF',
    parametersCount: 2,
    parameters: ['Total Serum Calcium', 'Inorganic Phosphorus'],
    fastingRequired: false,
    fastingInfo: 'Morning fasting preferred.',
    sampleType: 'Blood Serum',
    reportTime: '6 hours',
    description:
      'Tests essential electrolytes and minerals for bone metabolism, parathyroid function, and muscle contraction.',
    iconType: 'flask',
  },

  // --- Liver Function Tests ---
  {
    id: 'lft',
    name: 'Liver Function Test (LFT Complete)',
    category: 'liver',
    categoryName: 'Liver Function',
    shortDesc: '11 parameters \u2022 Bilirubin, SGOT, SGPT',
    price: 649,
    originalPrice: 1100,
    discount: '41% OFF',
    parametersCount: 11,
    parameters: [
      'Bilirubin Total',
      'Bilirubin Direct',
      'Bilirubin Indirect',
      'SGOT / AST (Aspartate Aminotransferase)',
      'SGPT / ALT (Alanine Aminotransferase)',
      'Alkaline Phosphatase (ALP)',
      'Gamma GT (GGT)',
      'Total Protein',
      'Serum Albumin',
      'Serum Globulin',
      'A:G Ratio',
    ],
    fastingRequired: true,
    fastingInfo: '10-12 hours overnight fasting required. Avoid alcohol 24h before.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Screening panel checking liver health, enzyme activity, jaundice markers, and protein synthesis.',
    popular: true,
    iconType: 'flask',
  },
  {
    id: 'sgpt_sgot',
    name: 'SGPT & SGOT (Liver Enzymes)',
    category: 'liver',
    categoryName: 'Liver Function',
    shortDesc: 'Liver transaminases \u2022 Fatty liver screen',
    price: 349,
    originalPrice: 600,
    discount: '42% OFF',
    parametersCount: 2,
    parameters: ['SGPT (ALT)', 'SGOT (AST)'],
    fastingRequired: true,
    fastingInfo: '8 hours fasting preferred.',
    sampleType: 'Blood Serum',
    reportTime: '6 hours',
    description:
      'Tests cellular liver damage enzymes, elevated in fatty liver disease, viral hepatitis, and medication stress.',
    iconType: 'flask',
  },
  {
    id: 'bilirubin_profile',
    name: 'Bilirubin Profile (Total, Direct & Indirect)',
    category: 'liver',
    categoryName: 'Liver Function',
    shortDesc: 'Jaundice marker \u2022 3 parameters',
    price: 249,
    originalPrice: 400,
    discount: '38% OFF',
    parametersCount: 3,
    parameters: ['Total Bilirubin', 'Direct (Conjugated) Bilirubin', 'Indirect Bilirubin'],
    fastingRequired: false,
    fastingInfo: '4 hours fasting preferred.',
    sampleType: 'Blood Serum',
    reportTime: '4 hours',
    description:
      'Detects bile pigment accumulation in blood causing yellowish eyes/skin in neonatal or adult jaundice.',
    iconType: 'flask',
  },

  // --- Kidney Function Tests ---
  {
    id: 'kft',
    name: 'Kidney Function Test (KFT / RFT Complete)',
    category: 'kidney',
    categoryName: 'Kidney Function',
    shortDesc: '9 parameters \u2022 Creatinine, Urea, Uric Acid',
    price: 599,
    originalPrice: 1050,
    discount: '43% OFF',
    parametersCount: 9,
    parameters: [
      'Serum Creatinine',
      'Blood Urea',
      'Blood Urea Nitrogen (BUN)',
      'Serum Uric Acid',
      'Serum Calcium',
      'Serum Phosphorus',
      'Serum Sodium (Na+)',
      'Serum Potassium (K+)',
      'Serum Chloride (Cl-)',
    ],
    fastingRequired: false,
    fastingInfo: 'No fasting strictly required. Stay adequately hydrated.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Comprehensive renal profile evaluating glomerular filtration, waste excretion, and balance of vital electrolytes.',
    popular: true,
    iconType: 'tubes',
  },
  {
    id: 'creatinine',
    name: 'Serum Creatinine with eGFR',
    category: 'kidney',
    categoryName: 'Kidney Function',
    shortDesc: 'Single marker \u2022 Renal filtration test',
    price: 179,
    originalPrice: 300,
    discount: '40% OFF',
    parametersCount: 2,
    parameters: ['Serum Creatinine', 'Estimated GFR (eGFR Calculation)'],
    fastingRequired: false,
    fastingInfo: 'No fasting required. Avoid heavy strenuous exercise prior.',
    sampleType: 'Blood Serum',
    reportTime: '4 hours',
    description:
      'Crucial marker used to calculate kidney filtration rate and detect early chronic kidney disease (CKD).',
    iconType: 'tubes',
  },
  {
    id: 'uric_acid',
    name: 'Serum Uric Acid',
    category: 'kidney',
    categoryName: 'Kidney Function',
    shortDesc: 'Gout & joint inflammation test',
    price: 199,
    originalPrice: 350,
    discount: '43% OFF',
    parametersCount: 1,
    parameters: ['Serum Uric Acid Level'],
    fastingRequired: true,
    fastingInfo: '4 hours fasting preferred.',
    sampleType: 'Blood Serum',
    reportTime: '4 hours',
    description:
      'Tests for high uric acid levels that crystallize in joints (gout) or form painful kidney stones.',
    iconType: 'flask',
  },
  {
    id: 'urine_re',
    name: 'Urine Routine & Microscopy',
    category: 'kidney',
    categoryName: 'Kidney Function',
    shortDesc: '18 parameters \u2022 UTI & kidney health',
    price: 199,
    originalPrice: 300,
    discount: '34% OFF',
    parametersCount: 18,
    parameters: [
      'Color & Appearance',
      'pH & Specific Gravity',
      'Urine Protein / Albumin',
      'Urine Glucose',
      'Ketones & Bilirubin',
      'Pus Cells (Leukocytes)',
      'Red Blood Cells (RBCs)',
      'Epithelial Cells',
      'Casts & Crystals',
    ],
    fastingRequired: false,
    fastingInfo: 'Early morning midstream urine sample is most accurate.',
    sampleType: 'Clean Catch Urine',
    reportTime: '4 hours',
    description:
      'Non-invasive test screening for urinary tract infections (UTI), proteinuria, kidney stones, and diabetes.',
    iconType: 'tubes',
  },

  // --- Heart Health ---
  {
    id: 'lipid_profile',
    name: 'Lipid Profile (Cholesterol & Triglycerides)',
    category: 'heart',
    categoryName: 'Heart & Lipid Care',
    shortDesc: '8 parameters \u2022 Heart health \u2022 Fasting',
    price: 599,
    originalPrice: 1100,
    discount: '46% OFF',
    parametersCount: 8,
    parameters: [
      'Total Cholesterol',
      'HDL (Good) Cholesterol',
      'LDL (Bad) Cholesterol',
      'Triglycerides',
      'VLDL Cholesterol',
      'Non-HDL Cholesterol',
      'TC / HDL Ratio',
      'LDL / HDL Ratio',
    ],
    fastingRequired: true,
    fastingInfo: '10-12 hours mandatory overnight fasting. Water permitted.',
    sampleType: 'Blood Serum',
    reportTime: '8 hours',
    description:
      'Evaluates circulatory cholesterol and fats to assess risk of cardiovascular disease, arterial plaque, and stroke.',
    popular: true,
    iconType: 'tubes',
  },

  // --- Full Body Package ---
  {
    id: 'full_body_basic',
    name: 'Comprehensive Full Body Checkup',
    category: 'fullbody',
    categoryName: 'Full Body Checkups',
    shortDesc: '63 parameters \u2022 Complete body screening',
    price: 1499,
    originalPrice: 3500,
    discount: '57% OFF',
    parametersCount: 63,
    parameters: [
      'Complete Blood Count (CBC - 24 Tests)',
      'Lipid Profile (8 Tests)',
      'Liver Function Test (LFT - 11 Tests)',
      'Kidney Function Test (KFT - 9 Tests)',
      'Fasting Blood Sugar (FBS)',
      'Thyroid Profile (TSH)',
      'Urine Routine & Microscopy (18 Tests)',
    ],
    fastingRequired: true,
    fastingInfo: '10-12 hours overnight fasting mandatory.',
    sampleType: 'Blood & Urine samples',
    reportTime: '12 hours',
    description:
      'All-inclusive preventive health health checkup covering vital organs including heart, liver, kidneys, blood, and endocrine system.',
    popular: true,
    iconType: 'tubes',
  },
];

export default function LabTestsScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<any>(null);

  // Navigation states: 'home' | 'category'
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestDetail, setSelectedTestDetail] = useState<LabTest | null>(null);
  const [cartTestIds, setCartTestIds] = useState<string[]>([]);

  // Split categories into chunks of 4 (identical to ConsultScreen)
  const categoryRows = useMemo(() => {
    const rows: Category[][] = [];
    for (let i = 0; i < CATEGORIES.length; i += 4) {
      rows.push(CATEGORIES.slice(i, i + 4));
    }
    return rows;
  }, []);

  // Filtered tests when searching
  const searchedTests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_TESTS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.parameters.some((p) => p.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Tests for active category
  const categoryTests = useMemo(() => {
    if (!activeCategory) return [];
    return ALL_TESTS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Popular tests list
  const popularTests = useMemo(() => {
    return ALL_TESTS.filter((t) => t.popular);
  }, []);

  // Cart total calculations
  const cartTests = useMemo(() => {
    return ALL_TESTS.filter((t) => cartTestIds.includes(t.id));
  }, [cartTestIds]);

  const cartTotal = useMemo(() => {
    return cartTests.reduce((sum, t) => sum + t.price, 0);
  }, [cartTests]);

  const toggleCart = (testId: string) => {
    setCartTestIds((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId],
    );
  };

  const handleBookCart = () => {
    Alert.alert(
      'Home Sample Collection',
      `You have selected ${cartTests.length} test(s) for a total of ₹${cartTotal}.\n\nA certified phlebotomist will arrive at Barabanki 225003 at your scheduled slot.`,
      [{ text: 'OK' }],
    );
  };

  // Render SVG Icon for tests
  const renderTestIcon = (type: 'tubes' | 'flask' | 'droplet') => {
    switch (type) {
      case 'tubes':
        return <SvgXml xml={TEST_TUBES_SVG} width={23} height={23} />;
      case 'flask':
        return <SvgXml xml={FLASK_SVG} width={23} height={23} />;
      case 'droplet':
      default:
        return <SvgXml xml={DROPLET_SVG} width={23} height={23} />;
    }
  };

  // Test item card component
  const renderTestCard = (t: LabTest) => {
    const isAdded = cartTestIds.includes(t.id);
    return (
      <Pressable
        key={t.id}
        style={({ pressed }) => [styles.testCard, pressed && { opacity: 0.94 }]}
        onPress={() => setSelectedTestDetail(t)}
        accessibilityRole="button"
        accessibilityLabel={`${t.name}, ₹${t.price}`}
      >
        <View style={styles.testSymbol}>{renderTestIcon(t.iconType)}</View>

        <View style={styles.testInfo}>
          <Text style={styles.testName} numberOfLines={1}>
            {t.name}
          </Text>
          <Text style={styles.testSub} numberOfLines={1}>
            {t.shortDesc}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{t.price}</Text>
            <Text style={styles.originalPriceText}>₹{t.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{t.discount}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.addButton, isAdded && styles.addedButton]}
          onPress={(e) => {
            e.stopPropagation();
            toggleCart(t.id);
          }}
          hitSlop={6}
          accessibilityLabel={isAdded ? `Remove ${t.name}` : `Add ${t.name}`}
        >
          {isAdded ? (
            <>
              <SvgXml xml={CHECK_SVG} width={10} height={10} />
              <Text style={styles.addedText}>Added</Text>
            </>
          ) : (
            <>
              <SvgXml xml={PLUS_SVG} width={10} height={10} />
              <Text style={styles.addText}>Add</Text>
            </>
          )}
        </Pressable>
      </Pressable>
    );
  };

  // Header Title based on screen
  const headerTitle = useMemo(() => {
    if (searchQuery.trim()) return 'SEARCH TESTS';
    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.id === activeCategory);
      return cat ? cat.name.toUpperCase() : 'LAB TESTS';
    }
    return 'LAB TESTS';
  }, [activeCategory, searchQuery]);

  const handleHeaderBack = () => {
    if (searchQuery) {
      setSearchQuery('');
      return;
    }
    if (activeCategory) {
      setActiveCategory(null);
      return;
    }
    onBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Lab tests unified header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <Pressable
              style={styles.backButton}
              onPress={handleHeaderBack}
              accessibilityLabel="Back"
              hitSlop={8}
            >
              <SvgXml xml={BACK_SVG} width={25} height={16} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {headerTitle}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <SvgXml xml={PIN_SVG} width={11} height={15} />
            <Text style={styles.locationText} numberOfLines={1}>
              Barabanki 225003
            </Text>
            <SvgXml xml={CHEVRON_DOWN_SVG} width={10} height={7} />
          </View>
        </View>

        <Pressable
          style={styles.searchBar}
          onPress={() => searchInputRef.current?.focus()}
        >
          <SvgXml xml={SEARCH_SVG} width={22} height={22} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tests (e.g. sugar, thyroid, cbc, liver)..."
            placeholderTextColor="#7e8184"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
              hitSlop={8}
            >
              <SvgXml xml={CLEAR_SVG} width={16} height={16} />
            </Pressable>
          )}
        </Pressable>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          cartTestIds.length > 0 && { paddingBottom: 90 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Results Mode */}
        {searchQuery.trim().length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchedTests.length})
            </Text>
            {searchedTests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No tests found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching for fasting blood sugar, thyroid, cbc, vitamins, or liver.
                </Text>
                <Pressable
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchBtnText}>Clear Search</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.testList}>{searchedTests.map(renderTestCard)}</View>
            )}
          </View>
        ) : activeCategory ? (
          /* Category Price Page Mode (Thyroid, Diabetes, Vitamins, Liver, Kidney, etc.) */
          <View style={styles.categoryPageContainer}>
            {/* Category Banner Card */}
            {(() => {
              const cat = CATEGORIES.find((c) => c.id === activeCategory);
              if (!cat) return null;
              return (
                <View style={styles.categoryHeroBanner}>
                  <View style={styles.categoryHeroImageWrap}>
                    <Image
                      source={cat.image}
                      style={styles.categoryHeroImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.categoryHeroCopy}>
                    <Text style={styles.categoryHeroTitle}>{cat.name} Page</Text>
                    <Text style={styles.categoryHeroSubtitle}>{cat.subtitle}</Text>
                    <View style={styles.categoryHeroTag}>
                      <Text style={styles.categoryHeroTagText}>
                        {categoryTests.length} Tests with transparent pricing
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            {/* Quick Switcher Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabsScroll}
            >
              {CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                    onPress={() => setActiveCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryTabText,
                        isActive && styles.activeCategoryTabText,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Available Tests List in Category */}
            <View style={styles.section}>
              <View style={styles.sectionHeadingRow}>
                <Text style={styles.sectionTitle}>Tests & Packages</Text>
                <Text style={styles.testCountNote}>
                  {categoryTests.length} tests available
                </Text>
              </View>
              <View style={styles.testList}>{categoryTests.map(renderTestCard)}</View>
            </View>
          </View>
        ) : (
          /* Main Lab Tests Overview Mode */
          <>
            {/* Home sample collection banner */}
            <View style={styles.banner}>
              <SvgXml xml={KIT_SVG} width={60} height={60} />
              <View style={styles.bannerCopy}>
                <Text style={styles.bannerTitle}>Lab tests, from home</Text>
                <Text style={styles.bannerSub}>
                  Certified phlebotomist home collection at your preferred slot.
                </Text>
              </View>
              <SvgXml xml={CHEVRON_RIGHT_SVG} width={16} height={16} />
            </View>

            {/* Browse by category - EXACT 4 in a row like ConsultScreen */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by category</Text>
              {categoryRows.map((row, i) => (
                <View
                  key={i}
                  style={[styles.tileRow, i > 0 && styles.tileRowGap]}
                >
                  {row.map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={({ pressed }) => [
                        styles.tile,
                        pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
                      ]}
                      onPress={() => setActiveCategory(cat.id)}
                      accessibilityRole="button"
                      accessibilityLabel={cat.name}
                    >
                      <View style={styles.tileCard}>
                        <Image
                          source={cat.image}
                          style={styles.tileImage}
                          resizeMode="cover"
                        />
                      </View>
                      <Text style={styles.tileLabel}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>

            {/* Popular tests section with price & more tests */}
            <View style={styles.section}>
              <View style={styles.sectionHeadingRow}>
                <Text style={styles.sectionTitle}>Popular tests</Text>
                <Pressable onPress={() => setActiveCategory('diabetes')}>
                  <Text style={styles.viewAll}>View all</Text>
                </Pressable>
              </View>

              <View style={styles.testList}>
                {popularTests.map(renderTestCard)}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Bottom Cart / Booking Bar */}
      {cartTestIds.length > 0 && (
        <View style={[styles.floatingCartBar, { bottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCountText}>
              {cartTestIds.length} {cartTestIds.length === 1 ? 'test' : 'tests'} selected
            </Text>
            <Text style={styles.cartPriceText}>₹{cartTotal}</Text>
          </View>
          <Pressable
            style={styles.bookCartButton}
            onPress={handleBookCart}
            accessibilityRole="button"
          >
            <Text style={styles.bookCartButtonText}>Book Home Collection</Text>
          </Pressable>
        </View>
      )}

      {/* Test Price & Details Modal */}
      <Modal
        visible={!!selectedTestDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTestDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedTestDetail(null)}
          />
          {selectedTestDetail && (
            <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalSymbol}>
                  {renderTestIcon(selectedTestDetail.iconType)}
                </View>
                <View style={styles.modalTitleWrap}>
                  <Text style={styles.modalCategoryBadge}>
                    {selectedTestDetail.categoryName}
                  </Text>
                  <Text style={styles.modalTestTitle}>
                    {selectedTestDetail.name}
                  </Text>
                </View>
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedTestDetail(null)}
                  hitSlop={8}
                >
                  <SvgXml xml={CLOSE_SVG} width={20} height={20} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Price Card */}
                <View style={styles.modalPriceCard}>
                  <View>
                    <Text style={styles.modalPriceLabel}>Test Price</Text>
                    <View style={styles.modalPriceRow}>
                      <Text style={styles.modalPriceValue}>
                        ₹{selectedTestDetail.price}
                      </Text>
                      <Text style={styles.modalOriginalPrice}>
                        ₹{selectedTestDetail.originalPrice}
                      </Text>
                      <View style={styles.modalDiscountBadge}>
                        <Text style={styles.modalDiscountText}>
                          {selectedTestDetail.discount}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.reportTimeBadge}>
                    <SvgXml xml={CLOCK_SVG} width={13} height={13} />
                    <Text style={styles.reportTimeText}>
                      Report in {selectedTestDetail.reportTime}
                    </Text>
                  </View>
                </View>

                {/* Requirements highlights */}
                <View style={styles.specsRow}>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Sample Type</Text>
                    <Text style={styles.specValue}>
                      {selectedTestDetail.sampleType}
                    </Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>Fasting Required?</Text>
                    <Text
                      style={[
                        styles.specValue,
                        selectedTestDetail.fastingRequired
                          ? { color: '#c0392b' }
                          : { color: '#27ae60' },
                      ]}
                    >
                      {selectedTestDetail.fastingRequired ? 'Yes (Fasting)' : 'No Fasting'}
                    </Text>
                  </View>
                </View>

                {/* Fasting Instructions Notice */}
                <View style={styles.noticeBox}>
                  <Text style={styles.noticeTitle}>Preparation Guidelines</Text>
                  <Text style={styles.noticeText}>
                    {selectedTestDetail.fastingInfo}
                  </Text>
                </View>

                {/* Description */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Why this test is done</Text>
                  <Text style={styles.detailDescription}>
                    {selectedTestDetail.description}
                  </Text>
                </View>

                {/* Parameters Tested */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Parameters Tested ({selectedTestDetail.parametersCount})
                  </Text>
                  <View style={styles.paramList}>
                    {selectedTestDetail.parameters.map((param, index) => (
                      <View key={index} style={styles.paramItem}>
                        <View style={styles.paramBullet} />
                        <Text style={styles.paramText}>{param}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Action Button */}
              <View style={styles.modalActionRow}>
                <Pressable
                  style={[
                    styles.modalAddToCartBtn,
                    cartTestIds.includes(selectedTestDetail.id) &&
                      styles.modalAddedBtn,
                  ]}
                  onPress={() => {
                    toggleCart(selectedTestDetail.id);
                  }}
                >
                  <Text style={styles.modalAddToCartText}>
                    {cartTestIds.includes(selectedTestDetail.id)
                      ? '✓ Test Added to Cart'
                      : `Add to Cart • ₹${selectedTestDetail.price}`}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d0e8',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 25,
    height: 16,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13.5,
    color: '#6b52ae',
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12.5,
    color: '#1d1b26',
  },
  searchBar: {
    marginTop: 14,
    marginHorizontal: 14,
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d0e8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 11,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14.5,
    color: '#1d1b26',
    paddingVertical: 0,
    outlineWidth: 0,
  } as object,
  clearBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 22,
  },
  banner: {
    backgroundColor: '#f5ede0',
    borderRadius: 16,
    height: 92,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#ece4d4',
  },
  bannerCopy: {
    flex: 1,
    gap: 5,
  },
  bannerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d1b26',
  },
  bannerSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#6b5d83',
  },
  section: {
    gap: 14,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    color: '#1d1b26',
  },
  viewAll: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12.5,
    color: '#6b52ae',
  },
  testCountNote: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
  },

  // 4 in a row layout - identical to ConsultScreen
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 13,
  },
  tileRowGap: {
    marginTop: 26,
  },
  tile: {
    width: 73,
    alignItems: 'center',
  },
  tileCard: {
    width: 73,
    height: 73,
    backgroundColor: '#f5ede0',
    borderRadius: 13,
    shadowColor: 'rgba(20, 37, 51, 0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileImage: {
    width: 65,
    height: 65,
    borderRadius: 9,
  },
  tileLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#1d1b26',
    textAlign: 'center',
    width: 86,
    marginTop: 9,
  },

  // Test List & Card
  testList: {
    gap: 12,
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ece8f5',
    paddingVertical: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(20, 37, 51, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  testSymbol: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5ede0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testInfo: {
    flex: 1,
    gap: 3,
  },
  testName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#1d1b26',
  },
  testSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#7e8184',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  priceText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#1d1b26',
  },
  originalPriceText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#999c9c',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#eaf6ec',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#2e7d32',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#6b52ae',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
  },
  addText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#6b52ae',
  },
  addedButton: {
    backgroundColor: '#6b52ae',
    borderColor: '#6b52ae',
  },
  addedText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#ffffff',
  },

  // Category Page Dedicated Styling
  categoryPageContainer: {
    gap: 18,
  },
  categoryHeroBanner: {
    backgroundColor: '#f5ede0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#ece4d4',
  },
  categoryHeroImageWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(20, 37, 51, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  categoryHeroImage: {
    width: 60,
    height: 60,
    borderRadius: 9,
  },
  categoryHeroCopy: {
    flex: 1,
    gap: 4,
  },
  categoryHeroTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#1d1b26',
  },
  categoryHeroSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#6b5d83',
  },
  categoryHeroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  categoryHeroTagText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#6b52ae',
  },
  categoryTabsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0edf7',
    borderWidth: 1,
    borderColor: '#e2ddf0',
  },
  activeCategoryTab: {
    backgroundColor: '#6b52ae',
    borderColor: '#6b52ae',
  },
  categoryTabText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#6b52ae',
  },
  activeCategoryTabText: {
    color: '#ffffff',
  },

  // Empty state
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d1b26',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#7e8184',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  clearSearchBtn: {
    backgroundColor: '#6b52ae',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#ffffff',
  },

  // Floating Cart Bar
  floatingCartBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#1d1b26',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  cartInfo: {
    gap: 2,
  },
  cartCountText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#c5c3cc',
  },
  cartPriceText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#ffffff',
  },
  bookCartButton: {
    backgroundColor: '#6b52ae',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  bookCartButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13.5,
    color: '#ffffff',
  },

  // Modal Sheet & Details
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '84%',
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0edf7',
  },
  modalSymbol: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5ede0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleWrap: {
    flex: 1,
    gap: 2,
  },
  modalCategoryBadge: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#6b52ae',
    textTransform: 'uppercase',
  },
  modalTestTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#1d1b26',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    marginTop: 14,
  },
  modalScrollContent: {
    gap: 16,
    paddingBottom: 20,
  },
  modalPriceCard: {
    backgroundColor: '#f8f7fc',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ece7f5',
  },
  modalPriceLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#7e8184',
    marginBottom: 4,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalPriceValue: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: '#1d1b26',
  },
  modalOriginalPrice: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#999c9c',
    textDecorationLine: 'line-through',
  },
  modalDiscountBadge: {
    backgroundColor: '#eaf6ec',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modalDiscountText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#2e7d32',
  },
  reportTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e1ef',
  },
  reportTimeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11.5,
    color: '#7e8184',
  },
  specsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  specBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ece7f5',
    gap: 4,
  },
  specLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11.5,
    color: '#7e8184',
  },
  specValue: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#1d1b26',
  },
  noticeBox: {
    backgroundColor: '#fef8f0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#faebd7',
    gap: 4,
  },
  noticeTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12.5,
    color: '#b26a00',
  },
  noticeText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 17,
    color: '#734d00',
  },
  detailSection: {
    gap: 8,
  },
  detailSectionTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14.5,
    color: '#1d1b26',
  },
  detailDescription: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#55525d',
  },
  paramList: {
    backgroundColor: '#fcfbfe',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0ecf7',
    gap: 8,
  },
  paramItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  paramBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6b52ae',
    marginTop: 6,
  },
  paramText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    color: '#2a2833',
  },
  modalActionRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0edf7',
  },
  modalAddToCartBtn: {
    backgroundColor: '#6b52ae',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddedBtn: {
    backgroundColor: '#27ae60',
  },
  modalAddToCartText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
});
